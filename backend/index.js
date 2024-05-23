const port = 5000;
const express = require('express')
const app = express();
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const axios = require('axios');
const multer = require('multer')
const path = require('path')
const cors = require('cors')
const bcrypt = require('bcryptjs');

app.use(express.json());
app.use(cors());
// app.use(express.static('public'));

// Database Connection With MongoDB
mongoose.connect('mongodb+srv://tamminh:persistence@cluster0.ja7wxjn.mongodb.net/e-commerce?retryWrites=true&w=majority&appName=Cluster0')

// API Creation

// app.get('/', (req, res) => {
    
//     res.sendfile(__dirname + '/public/index.html');
// })

app.get('/', (req, res) => {
    res.send('Express App is Running')
})

const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({storage: storage});

app.use('/images', express.static('upload/images'));

app.post('/upload', upload.array('product', 5), (req, res) => {
    const fileUrls = req.files.map(file => `http://localhost:${port}/images/${file.filename}`);
    res.json({
        success: 1,
        image_urls: fileUrls
    });
});

app.post('/uploadsingle', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: 0, message: 'No file uploaded.' });
    }

    const fileUrl = `http://localhost:${port}/images/${req.file.filename}`;
    res.json({
        success: 1,
        image_url: fileUrl
    });
});



// Schema creating for Category model
const Category = mongoose.model('Category', {
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: '',
    },
    published: {
        type: Boolean,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    }
})

// Creating API for adding categories
app.post('/addcategory', async (req, res) => {

    let categories = await Category.find({});
    let id;
    if (categories.length > 0) {
        let last_category_array = categories.slice(-1);
        let last_category = last_category_array[0];
        
        id = last_category.id + 1;
    }
    else {
        id = 1;
    }

    const category = new Category({
        id: id,
        name: req.body.name,
        description: req.body.description,
        published: req.body.published,
    });

    console.log(category);

    await category.save();
    console.log('Saved');
    res.json({
        success: true,
        name: req.body.name,
    })
})

// Creating API for deleting categories
app.post('/removecategory', async (req, res) => {
    try {
        const categoryId = req.body._id;

        // Lấy thông tin của danh mục trước khi xóa
        const category = await Category.findOne({ _id: categoryId });

        // Lưu trữ thông tin của danh mục đã xóa vào Schema mới
        await DeletedItems.create({
            type: 'category',
            data: category
        });

        // Lấy tất cả các sản phẩm có tham chiếu đến ID của danh mục được xóa
        const deletedProducts = await Product.find({ category: categoryId });

        // Lưu trữ thông tin của các sản phẩm đã xóa vào Schema mới
        for (const product of deletedProducts) {
            await DeletedItems.create({
                type: 'product',
                data: product
            });
        }

        // Xóa tất cả các sản phẩm có tham chiếu đến ID của danh mục được xóa
        await Product.deleteMany({ category: categoryId });

        // Sau đó xóa danh mục
        await Category.findOneAndDelete({ _id: categoryId });

        console.log("Category and associated products removed");
        res.json({
            success: true,
            categoryId: categoryId,
        });
    } catch (error) {
        console.error("Error removing category and associated products:", error);
        res.status(500).json({ success: false, message: 'Error removing category and associated products' });
    }
})

// Endpoint để phục hồi danh mục đã xóa
app.post('/restorecategory', async (req, res) => {
    try {
        const categoryId = req.body.id;
        // const catId = req.body._id;

        // Lấy thông tin của danh mục từ dữ liệu đã lưu trữ
        const deletedCategory = await DeletedItems.findOne({ type: 'category', 'data.id': categoryId });

        console.log(deletedCategory);

        if (!deletedCategory) {
            return res.status(404).json({ success: false, message: 'Deleted category not found' });
        }

        // Tạo lại danh mục từ thông tin đã lưu trữ
        const restoredCategory = new Category(deletedCategory.data);
        await restoredCategory.save();

        // Sau khi phục hồi, xóa dữ liệu đã lưu trữ
        await DeletedItems.findOneAndDelete({ _id: deletedCategory._id });
        // await DeletedItems.deleteMany({ 'data.category': categoryId });

        console.log("Category restored");
        res.json({
            success: true,
            categoryId: categoryId,
        });
    } catch (error) {
        console.error("Error restoring category:", error);
        res.status(500).json({ success: false, message: 'Error restoring category' });
    }
});


// Creating API for getting category details
app.get('/detailscategory/:id', async (req, res) => {
    try {
        const categoryId = req.params.id;

        const category = await Category.findOne({ id: categoryId });

        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        console.log("Category Details Fetched");
        res.json({
            success: true,
            category: category
        });
    } catch (error) {
        console.error("Error fetching category details:", error);
        res.status(500).json({ success: false, message: 'Error fetching category details' });
    }
})

// Creating API for updating Categories
app.put('/updatecategory/:id', async (req, res) => {
    try {
        const categoryId = req.params.id;
        const updates = req.body;

        const category = await Category.findOne({ id: categoryId });

        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        // Update category fields based on request body
        Object.keys(updates).forEach(key => {
            category[key] = updates[key];
        });

        await category.save();

        console.log("Category Updated");
        res.json({
            success: true,
            message: 'Category updated successfully',
            category: category
        });
    } catch (error) {
        console.error("Error updating category:", error);
        res.status(500).json({ success: false, message: 'Error updating category' });
    }
})

// Creating API for getting all categories
app.get('/allcategories', async (req, res) => {
    let categories = await Category.find({});
    console.log("All Categories Fetch");
    res.send(categories);
})



// Schema for Creating Products
const Product = mongoose.model('Product', {
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    main_img: {
        type: String,
        required: true,
    },
    sub_img: {
        type: Array,
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId, // Trường tham chiếu đến ID của Category
        ref: 'Category', // Tên của model Category
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    sizes: [{
        size: { type: mongoose.Schema.Types.ObjectId, ref: 'Size' },
        quantity: { type: Number, default: 0 }
    }],
    date: {
        type: Date,
        default: Date.now,
    },
    available: {
        type: Boolean,
        default: true,
    },
})


// Creating API for adding products
app.post('/addproduct', async (req, res) => {
    try {
        let products = await Product.find({});
        let id;
        if (products.length > 0) {
            let last_product_array = products.slice(-1);
            let last_product = last_product_array[0];
            
            id = last_product.id + 1;
        }
        else {
            id = 1;
        }

        // Lấy ID của Category từ request body
        const categoryId = req.body.category;
        // Kiểm tra xem Category có tồn tại không
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(400).json({ success: false, message: 'Invalid category ID' });
        }

        // Tiếp tục tạo sản phẩm với trường category là ID của Category
        const product = new Product({
            id: id,
            name: req.body.name,
            main_img: req.body.main_img,
            sub_img: req.body.sub_img,
            category: categoryId, // Trường category là ID của Category
            price: req.body.price,
            sizes: req.body.sizes
        });

        await product.save();
        console.log('Saved');
        res.json({
            success: true,
            name: req.body.name,
        });
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ success: false, message: 'Error adding product' });
    }
});

// Creating API for getting product details
app.get('/detailsproduct/:id', async (req, res) => {
    try {
        const productId = req.params.id;

        const product = await Product.findOne({ id: productId });

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        console.log("Product Details Fetched");
        res.json({
            success: true,
            product: product
        });
    } catch (error) {
        console.error("Error fetching product details:", error);
        res.status(500).json({ success: false, message: 'Error fetching product details' });
    }
})

// Creating API for updating Products
app.put('/updateproduct/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const updates = req.body;

        const product = await Product.findOne({ id: productId });

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        // Update product fields based on request body
        Object.keys(updates).forEach(key => {
            product[key] = updates[key];
        });

        await product.save();

        console.log("Product Updated");
        res.json({
            success: true,
            message: 'Product updated successfully',
            product: product
        });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ success: false, message: 'Error updating product' });
    }
})

// Creating API for deleting Products
app.post('/removeproduct', async (req, res) => {
    const productId = req.body.id;

    // Lấy thông tin của sản phẩm trước khi xóa
    const product = await Product.findOne({ id: productId });

    // Lưu trữ thông tin của sản phẩm đã xóa vào Schema mới
    await DeletedItems.create({
        type: 'product',
        data: product
    });

    await Product.findOneAndDelete({ id: req.body.id });

    console.log("Removed");
    res.json({
        success: true,
        name: req.body.name,
    })
})

// Endpoint để phục hồi danh mục đã xóa
app.post('/restoreproduct', async (req, res) => {
    try {
        const productId = req.body.id;

        // Lấy thông tin của danh mục từ dữ liệu đã lưu trữ
        const deletedProduct = await DeletedItems.findOne({ type: 'product', 'data.id': productId });

        console.log(deletedProduct);
        
        if (!deletedProduct) {
            return res.status(404).json({ success: false, message: 'Deleted product not found' });
        }

        // Tạo lại danh mục từ thông tin đã lưu trữ
        const restoredProduct = new Product(deletedProduct.data);
        await restoredProduct.save();

        // Sau khi phục hồi, xóa dữ liệu đã lưu trữ
        await DeletedItems.findOneAndDelete({ _id: deletedProduct._id });

        console.log("Product restored");
        res.json({
            success: true,
            productId: productId,
        });
    } catch (error) {
        console.error("Error restoring category:", error);
        res.status(500).json({ success: false, message: 'Error restoring category' });
    }
});

// Creating API for getting all products
app.get('/allproducts', async (req, res) => {
    let products = await Product.find({});
    console.log("All Products Fetch");
    res.send(products);
})

// creating endpoint for new in data
app.get('/newin', async (req, res) => {
    let products = await Product.find({});
    let newIn = products.slice(1).slice(-8);

    console.log('NewIn Fetched');
    res.send(newIn)
})

app.get('/explore', async (req, res) => {
    try {
        let products = await Product.aggregate([
            { $match: { price: { $gt: 30 } } }, // Lọc ra các sản phẩm có giá lớn hơn 30
            { $sample: { size: 4 } } // Lấy ngẫu nhiên 4 sản phẩm từ kết quả lọc
        ]);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/trending', async (req, res) => {
    try {
        let products = await Product.aggregate([
            { $match: { price: { $gte: 40 } } }, // Lọc ra các sản phẩm có giá lớn hơn 30
            { $sample: { size: 1 } } // Lấy ngẫu nhiên 4 sản phẩm từ kết quả lọc
        ]);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Creating API for searching products
app.get('/search', async (req, res) => {
    const { q } = req.query;

    // Fetch search results from the database
    const results = await Product.find({
        name: { $regex: q, $options: 'i' },
    }).limit(5);

    res.json({ results });
});

// Schema for Creating Size Products
const Size = mongoose.model('Size', {
    id: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    }
})

// Creating API for adding size
app.post('/addsize', async (req, res) => {

    let sizes = await Size.find({});
    let id;
    if (sizes.length > 0) {
        let last_size_array = sizes.slice(-1);
        let last_size = last_size_array[0];
        
        id = last_size.id + 1;
    }
    else {
        id = 1;
    }

    const size = new Size({
        id: id,
        type: req.body.type,
        name: req.body.name,
    });

    console.log(size);

    await size.save();
    console.log('Saved');
    res.json({
        success: true,
        name: req.body.name,
    })
})

// Creating API for deleting size
app.post('/removesize', async (req, res) => {
    try {
        const sizeId = req.body.id;

        // Lấy thông tin của danh mục trước khi xóa
        const size = await Size.findOne({ id: sizeId });

        // Lưu trữ thông tin của danh mục đã xóa vào Schema mới
        await DeletedItems.create({
            type: 'size',
            data: size
        });

        // Sau đó xóa danh mục
        await Size.findOneAndDelete({ id: sizeId });

        console.log("Size removed");
        res.json({
            success: true,
            sizeId: sizeId,
        });
    } catch (error) {
        console.error("Error removing size:", error);
        res.status(500).json({ success: false, message: 'Error removing size' });
    }
})

// Endpoint để phục hồi size đã xóa
app.post('/restoresize', async (req, res) => {
    try {
        const sizeId = req.body.id;
        // const catId = req.body._id;

        // Lấy thông tin của danh mục từ dữ liệu đã lưu trữ
        const deletedSize = await DeletedItems.findOne({ type: 'size', 'data.id': sizeId });

        console.log(deletedSize);

        if (!deletedSize) {
            return res.status(404).json({ success: false, message: 'Deleted size not found' });
        }

        // Tạo lại danh mục từ thông tin đã lưu trữ
        const restoredSize = new Size(deletedSize.data);
        await restoredSize.save();

        // Sau khi phục hồi, xóa dữ liệu đã lưu trữ
        await DeletedItems.findOneAndDelete({ _id: deletedSize._id });

        console.log("Size restored");
        res.json({
            success: true,
            sizeId: sizeId,
        });
    } catch (error) {
        console.error("Error restoring size:", error);
        res.status(500).json({ success: false, message: 'Error restoring size' });
    }
});

// Creating API for getting size details
app.get('/detailssize/:id', async (req, res) => {
    try {
        const sizeId = req.params.id;

        const size = await Size.findOne({ id: sizeId });

        if (!size) {
            return res.status(404).json({ success: false, message: 'Size not found' });
        }

        console.log("Size Details Fetched");
        res.json({
            success: true,
            size: size
        });
    } catch (error) {
        console.error("Error fetching size details:", error);
        res.status(500).json({ success: false, message: 'Error fetching size details' });
    }
})

// Creating API for updating Size
app.put('/updatesize/:id', async (req, res) => {
    try {
        const sizeId = req.params.id;
        const updates = req.body;

        const size = await Size.findOne({ id: sizeId });

        if (!size) {
            return res.status(404).json({ success: false, message: 'Size not found' });
        }

        // Update category fields based on request body
        Object.keys(updates).forEach(key => {
            size[key] = updates[key];
        });

        await size.save();

        console.log("Size Updated");
        res.json({
            success: true,
            message: 'Size updated successfully',
            size: size
        });
    } catch (error) {
        console.error("Error updating size:", error);
        res.status(500).json({ success: false, message: 'Error updating size' });
    }
})

// Creating API for getting all sizes
app.get('/allsizes', async (req, res) => {
    let sizes = await Size.find({});
    console.log("All Sizes Fetch");
    res.send(sizes);
})




// Schema mới cho việc lưu trữ danh mục và sản phẩm đã xóa
const DeletedItems = mongoose.model('DeletedItems', {
    type: {
        type: String, // 'category' hoặc 'product'
        required: true
    },
    data: {
        type: Object,
        required: true
    },
    deletedAt: {
        type: Date,
        default: Date.now
    }
});

// Creating API for deleting Products
app.post('/removedeleteditems', async (req, res) => {
    const itemId = req.body._id;

    await DeletedItems.findOneAndDelete({ _id: itemId });

    console.log("Removed");
    res.json({
        success: true
    })
})

// Creating API for getting all products
app.get('/alldeleteditems', async (req, res) => {
    let deletedItems = await DeletedItems.find({});
    console.log("All Deleted items Fetch");
    res.send(deletedItems);
})



// Schema creating for User model
const Users = mongoose.model('Users', {
    name: {
        type: String,
    },
    birthday: {
        type: Date,
        default: Date.now,
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'not', 'skip', ''],
        default: '',
    },
    avatar: {
        type: String,
        default: '',
    },
    address: {
        type: String,
        default: '',
    },
    phone: {
        type: String,
        default: '',
    },
    city: {
        type: String,
        default: '',
    },
    province: {
        type: String,
        default: '',
    },
    district: {
        type: String,
        default: '',
    },
    commune: {
        type: String,
        default: '',
    },
    country: {
        type: String,
        default: '',
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    cartData: {
        type: Object,
    },
    wishlistData: {
        type: Object,
    },
    date: {
        type: Date,
        default: Date.now,
    }
})

// Creating API for getting users details
app.get('/detailsuser/:id', async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await Users.findOne({ _id: userId });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        console.log("User Details Fetched");
        res.json({
            success: true,
            user: user
        });
    } catch (error) {
        console.error("Error fetching user details:", error);
        res.status(500).json({ success: false, message: 'Error fetching user details' });
    }
})

// Creating API for verify password for users
app.post('/verifyPassword', async (req, res) => {
    try {
        const { userId, currentPassword } = req.body;
        const user = await Users.findOne({ _id: userId });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Current password is incorrect' });
        }

        res.json({ success: true });
    } catch (error) {
        console.error("Error verifying password:", error);
        res.status(500).json({ success: false, message: 'Error verifying password' });
    }
});


// Creating API for updating Users
app.put('/updateuser/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const updates = req.body;

        const user = await Users.findOne({ _id: userId });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // If the password is being updated, hash the new password before saving
        if (updates.password) {
            const salt = await bcrypt.genSalt(10);
            updates.password = await bcrypt.hash(updates.password, salt);
        }

        // Update category fields based on request body
        Object.keys(updates).forEach(key => {
            user[key] = updates[key];
        });

        await user.save();

        console.log("User Updated");
        res.json({
            success: true,
            message: 'User updated successfully',
            user: user
        });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ success: false, message: 'Error updating user' });
    }
});

// Creating API for get all users
app.get('/allusers', async (req, res) => {
    let users = await Users.find({});
    console.log("All Users Fetch");
    res.send(users);
})

const RECAPTCHA_SECRET_KEY = '6Le9ouEpAAAAAHp7VduQ_TBFF92HfX7WWoihrUf7';

async function verifyCaptcha(token) {
    const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${token}`);
    return response.data.success;
}

// Creating Endpoint for registering the user
app.post('/signup', async (req, res) => {
    try {
        const { name, email, password, captchaToken } = req.body;

        const isCaptchaValid = await verifyCaptcha(captchaToken);
        if (!isCaptchaValid) {
            return res.status(400).json({ success: false, errors: 'Invalid CAPTCHA' });
        }

        let check = await Users.findOne({ email });
        if (check) {
            return res.status(400).json({ success: false, errors: 'existing user found with same email address' });
        }

        let cart = {};
        for (let i = 0; i < 300; i++) {
            cart[i] = 0;
        }

        let wishlist = {};
        for (let i = 0; i < 300; i++) {
            wishlist[i] = 0;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new Users({
            name,
            email,
            password: hashedPassword,
            cartData: cart,
            wishlistData: wishlist,
        });

        await user.save();

        const data = {
            user: {
                id: user.id,
            }
        };

        const token = jwt.sign(data, 'secret_ecom');
        const userId = user._id;
        res.json({ success: true, token, userId });
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ success: false, message: 'Error during signup' });
    }
});

// creating endpoint for user login
app.post('/login', async (req, res) => {
    try {
        const { email, password, captchaToken } = req.body;

        const isCaptchaValid = await verifyCaptcha(captchaToken);
        if (!isCaptchaValid) {
            return res.status(400).json({ success: false, errors: 'Invalid CAPTCHA' });
        }

        let user = await Users.findOne({ email });
        if (user) {
            const passCompare = await bcrypt.compare(password, user.password);
            if (passCompare) {
                const data = {
                    user: {
                        id: user.id,
                    }
                };
                const token = jwt.sign(data, 'secret_ecom');
                const userId = user._id;
                res.json({ success: true, token, userId });
            } else {
                res.status(400).json({ success: false, errors: 'Wrong Password' });
            }
        } else {
            res.status(400).json({ success: false, errors: 'Wrong Email Id' });
        }
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ success: false, message: 'Error during login' });
    }
});


// creating middleware to fetch user
const fetchUser = async (req, res, next) => {
    const token = req.header('auth-token');
    
    if (!token) {
        res.status(401).send({ errors: "Please authenticate using valid token" })
    }
    else {
        try {
            const data = jwt.verify(token, 'secret_ecom');
            req.user = data.user;
            next();
        } catch (error) {
            res.status(401).send({ errors: "Please authenticate using a valid token" })
        }
    }
}

// creating endpoint for adding products in cart data
app.post('/addtocart', fetchUser, async (req, res) => {
    console.log('Added', req.body.itemId);

    try {
        let userData = await Users.findOne({ _id: req.user.id });

        // Find the product corresponding to the itemId
        const product = await Product.findOne({ id: req.body.itemId });

        if (!product) {
            throw new Error('Product not found');
        }

        // Update quantity of size product
        const size = await Size.findOne({ _id: req.body.size });
        const sizeInProduct = product.sizes.find(sizeObj => sizeObj.size.equals(size._id));
        if (sizeInProduct) {
            sizeInProduct.quantity -= 1;
            await product.save();
        }

        // Update user's cart data
        if (!userData.cartData[req.body.itemId]) {
            userData.cartData[req.body.itemId] = { quantity: 1, size: req.body.size };
        } else {
            userData.cartData[req.body.itemId].quantity += 1;
            userData.cartData[req.body.itemId].size = req.body.size;
        }

        await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData })

        res.json({ message: 'added', quantity: userData.cartData[req.body.itemId].quantity });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Creating endpoint to remove product from cart data
app.post('/removefromcart', fetchUser, async (req, res) => {
    console.log("removed", req.body.itemId);
    try {
        let userData = await Users.findOne({ _id: req.user.id });

        const product = await Product.findOne({ id: req.body.itemId });

        // Update quantity of size product
        const size = await Size.findOne({ _id: req.body.size });
        const sizeInProduct = product.sizes.find(sizeObj => sizeObj.size.equals(size._id));
        if (sizeInProduct) {
            sizeInProduct.quantity += 1;
            await product.save();
        }

        // Update user's cart data
        if (userData && userData.cartData[req.body.itemId].quantity > 0) {
            userData.cartData[req.body.itemId].quantity -= 1;
            await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData })
        } else {
            throw new Error('Item not found in cart');
        }

        // Send success response
        res.json({ message: 'removed', quantity: userData.cartData[req.body.itemId].quantity });
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Creating endpoint to get cart data
app.post('/getcart', fetchUser, async (req, res) => {
    console.log("GetCart");

    let userData = await Users.findOne({_id: req.user.id});
    res.json(userData.cartData);
})

// creating endpoint for adding products in wish list data
app.post('/addtowishlist', fetchUser, async (req, res) => {
    console.log('Added', req.body.itemId);

    let userData = await Users.findOne({ _id: req.user.id });

    // Kiểm tra nếu userData.wishlistData không được định nghĩa, hãy khởi tạo nó
    if (!userData.wishlistData) {
        userData.wishlistData = {};
    }

    // Kiểm tra xem req.body.itemId có tồn tại trong wishlistData không
    if (!userData.wishlistData[req.body.itemId]) {
        userData.wishlistData[req.body.itemId] = 0;
    }

    userData.wishlistData[req.body.itemId] += 1;

    await Users.findOneAndUpdate({ _id: req.user.id }, { wishlistData: userData.wishlistData });
    res.json({ message: 'added' });
})

// Creating endpoint to remove product from wish list data
app.post('/removefromwishlist', fetchUser, async (req, res) => {
    console.log("removed", req.body.itemId);
    let userData = await Users.findOne({_id: req.user.id});
    
    if (userData.wishlistData[req.body.itemId] > 0) {
        userData.wishlistData[req.body.itemId] -= 1;
    }
    await Users.findOneAndUpdate({_id: req.user.id}, {wishlistData: userData.wishlistData})
    res.json({ message: 'removed' });
})

// Creating endpoint to get wish list data
app.post('/getwishlist', fetchUser, async (req, res) => {
    console.log("Get wish list");

    let userData = await Users.findOne({_id: req.user.id});
    res.json(userData.wishlistData);
})


// Schema for Creating Status Orders
const Status = mongoose.model('Status', {
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: '',
    },
    date: {
        type: Date,
        default: Date.now,
    }
})

// Creating API for adding status
app.post('/addstatus', async (req, res) => {

    let status = await Status.find({});
    let id;
    if (status.length > 0) {
        let last_status_array = status.slice(-1);
        let last_status = last_status_array[0];
        
        id = last_status.id + 1;
    }
    else {
        id = 1;
    }

    const state = new Status({
        id: id,
        name: req.body.name,
        description: req.body.description,
    });

    console.log(state);

    await state.save();
    console.log('Saved');
    res.json({
        success: true,
        name: req.body.name,
    })
})

// Creating API for deleting status
app.post('/removestatus', async (req, res) => {
    try {
        const statusId = req.body.id;

        // Lấy thông tin của danh mục trước khi xóa
        const status = await Status.findOne({ id: statusId });

        // Lưu trữ thông tin của danh mục đã xóa vào Schema mới
        await DeletedItems.create({
            type: 'status',
            data: status
        });

        // Sau đó xóa danh mục
        await Status.findOneAndDelete({ id: statusId });

        console.log("Status removed");
        res.json({
            success: true,
            statusId: statusId,
        });
    } catch (error) {
        console.error("Error removing status:", error);
        res.status(500).json({ success: false, message: 'Error removing status' });
    }
})

// Endpoint để phục hồi status đã xóa
app.post('/restorestatus', async (req, res) => {
    try {
        const statusId = req.body.id;
        // const catId = req.body._id;

        // Lấy thông tin của danh mục từ dữ liệu đã lưu trữ
        const deletedStatus = await DeletedItems.findOne({ type: 'status', 'data.id': statusId });

        console.log(deletedStatus);

        if (!deletedStatus) {
            return res.status(404).json({ success: false, message: 'Deleted status not found' });
        }

        // Tạo lại danh mục từ thông tin đã lưu trữ
        const restoredStatus = new Status(deletedStatus.data);
        await restoredStatus.save();

        // Sau khi phục hồi, xóa dữ liệu đã lưu trữ
        await DeletedItems.findOneAndDelete({ _id: deletedStatus._id });

        console.log("Status restored");
        res.json({
            success: true,
            statusId: statusId,
        });
    } catch (error) {
        console.error("Error restoring status:", error);
        res.status(500).json({ success: false, message: 'Error restoring status' });
    }
});

// Creating API for getting status details
app.get('/detailsstatus/:id', async (req, res) => {
    try {
        const statusId = req.params.id;

        const status = await Status.findOne({ id: statusId });

        if (!status) {
            return res.status(404).json({ success: false, message: 'Status not found' });
        }

        console.log("Status Details Fetched");
        res.json({
            success: true,
            status: status
        });
    } catch (error) {
        console.error("Error fetching status details:", error);
        res.status(500).json({ success: false, message: 'Error fetching status details' });
    }
})

// Creating API for updating Status
app.put('/updatestatus/:id', async (req, res) => {
    try {
        const statusId = req.params.id;
        const updates = req.body;

        const status = await Status.findOne({ id: statusId });

        if (!status) {
            return res.status(404).json({ success: false, message: 'Status not found' });
        }

        // Update category fields based on request body
        Object.keys(updates).forEach(key => {
            status[key] = updates[key];
        });

        await status.save();

        console.log("Status Updated");
        res.json({
            success: true,
            message: 'Status updated successfully',
            status: status
        });
    } catch (error) {
        console.error("Error updating status:", error);
        res.status(500).json({ success: false, message: 'Error updating status' });
    }
})

// Creating API for getting all sizes
app.get('/allstatus', async (req, res) => {
    let status = await Status.find({});
    console.log("All Status Fetch");
    res.send(status);
})



// Schema for Creating Payment
const Payment = mongoose.model('Payment', {
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: '',
    },
    payData: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Pay',
    },
    date: {
        type: Date,
        default: Date.now,
    }
})

// Creating API for adding payment
app.post('/addpayment', async (req, res) => {

    let payments = await Payment.find({});
    let id;
    if (payments.length > 0) {
        let last_payment_array = payments.slice(-1);
        let last_payment = last_payment_array[0];
        
        id = last_payment.id + 1;
    }
    else {
        id = 1;
    }

    const payment = new Payment({
        id: id,
        name: req.body.name,
        description: req.body.description,
    });

    console.log(payment);

    await payment.save();
    console.log('Saved');
    res.json({
        success: true,
        name: req.body.name,
    })
})

// Creating API for deleting payment
app.post('/removepayment', async (req, res) => {
    try {
        const paymentId = req.body.id;

        // Lấy thông tin của danh mục trước khi xóa
        const payment = await Payment.findOne({ id: paymentId });

        // Lưu trữ thông tin của danh mục đã xóa vào Schema mới
        await DeletedItems.create({
            type: 'payment',
            data: payment
        });

        // Sau đó xóa danh mục
        await Payment.findOneAndDelete({ id: paymentId });

        console.log("payment removed");
        res.json({
            success: true,
            paymentId: paymentId,
        });
    } catch (error) {
        console.error("Error removing payment:", error);
        res.payment(500).json({ success: false, message: 'Error removing payment' });
    }
})

// Endpoint để phục hồi payment đã xóa
app.post('/restorepayment', async (req, res) => {
    try {
        const paymentId = req.body.id;
        // const catId = req.body._id;

        // Lấy thông tin của danh mục từ dữ liệu đã lưu trữ
        const deletedPayment = await DeletedItems.findOne({ type: 'payment', 'data.id': paymentId });

        console.log(deletedPayment);

        if (!deletedPayment) {
            return res.payment(404).json({ success: false, message: 'Deleted payment not found' });
        }

        // Tạo lại danh mục từ thông tin đã lưu trữ
        const restoredPayment = new Payment(deletedPayment.data);
        await restoredPayment.save();

        // Sau khi phục hồi, xóa dữ liệu đã lưu trữ
        await DeletedItems.findOneAndDelete({ _id: deletedPayment._id });

        console.log("Payment restored");
        res.json({
            success: true,
            paymentId: paymentId,
        });
    } catch (error) {
        console.error("Error restoring payment:", error);
        res.payment(500).json({ success: false, message: 'Error restoring payment' });
    }
});

// Creating API for getting payment details
app.get('/detailspayment/:id', async (req, res) => {
    try {
        const paymentId = req.params.id;

        const payment = await Payment.findOne({ id: paymentId });

        if (!payment) {
            return res.payment(404).json({ success: false, message: 'payment not found' });
        }

        console.log("payment Details Fetched");
        res.json({
            success: true,
            payment: payment
        });
    } catch (error) {
        console.error("Error fetching payment details:", error);
        res.payment(500).json({ success: false, message: 'Error fetching payment details' });
    }
})

// Creating API for updating payment
app.put('/updatepayment/:id', async (req, res) => {
    try {
        const paymentId = req.params.id;
        const updates = req.body;

        const payment = await Payment.findOne({ id: paymentId });

        if (!payment) {
            return res.payment(404).json({ success: false, message: 'payment not found' });
        }

        // Update category fields based on request body
        Object.keys(updates).forEach(key => {
            payment[key] = updates[key];
        });

        await payment.save();

        console.log("payment Updated");
        res.json({
            success: true,
            message: 'payment updated successfully',
            payment: payment
        });
    } catch (error) {
        console.error("Error updating payment:", error);
        res.payment(500).json({ success: false, message: 'Error updating payment' });
    }
})

// Creating API for getting all payments
app.get('/allpayments', async (req, res) => {
    let payments = await Payment.find({});
    console.log("All payments Fetch");
    res.send(payments);
})


// Schema for Creating Pay
const Pay = mongoose.model('Pay', {
    id: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: '',
    },
    date: {
        type: Date,
        default: Date.now,
    }
})

// Creating API for adding pay
app.post('/addpay', async (req, res) => {

    let pays = await Pay.find({});
    let id;
    if (pays.length > 0) {
        let last_pay_array = pays.slice(-1);
        let last_pay = last_pay_array[0];
        
        id = last_pay.id + 1;
    }
    else {
        id = 1;
    }

    const pay = new Pay({
        id: id,
        type: req.body.type,
        name: req.body.name,
        image: req.body.image,
    });

    console.log(pay);

    await pay.save();
    console.log('Saved');
    res.json({
        success: true,
        name: req.body.name,
    })
})

// Creating API for deleting pay
app.post('/removepay', async (req, res) => {
    try {
        const payId = req.body.id;

        // Lấy thông tin của danh mục trước khi xóa
        const pay = await Pay.findOne({ id: payId });

        // Lưu trữ thông tin của danh mục đã xóa vào Schema mới
        await DeletedItems.create({
            type: 'pay',
            data: pay
        });

        // Sau đó xóa danh mục
        await Pay.findOneAndDelete({ id: payId });

        console.log("pay removed");
        res.json({
            success: true,
            payId: payId,
        });
    } catch (error) {
        console.error("Error removing pay:", error);
        res.pay(500).json({ success: false, message: 'Error removing pay' });
    }
})

// Endpoint để phục hồi pay đã xóa
app.post('/restorepay', async (req, res) => {
    try {
        const payId = req.body.id;
        // const catId = req.body._id;

        // Lấy thông tin của danh mục từ dữ liệu đã lưu trữ
        const deletedPay = await DeletedItems.findOne({ type: 'pay', 'data.id': payId });

        console.log(deletedPay);

        if (!deletedPay) {
            return res.pay(404).json({ success: false, message: 'Deleted pay not found' });
        }

        // Tạo lại danh mục từ thông tin đã lưu trữ
        const restoredPay = new Pay(deletedPay.data);
        await restoredPay.save();

        // Sau khi phục hồi, xóa dữ liệu đã lưu trữ
        await DeletedItems.findOneAndDelete({ _id: deletedPay._id });

        console.log("Pay restored");
        res.json({
            success: true,
            payId: payId,
        });
    } catch (error) {
        console.error("Error restoring pay:", error);
        res.pay(500).json({ success: false, message: 'Error restoring pay' });
    }
});

// Creating API for getting pay details
app.get('/detailspay/:id', async (req, res) => {
    try {
        const payId = req.params.id;

        const pay = await Pay.findOne({ id: payId });

        if (!pay) {
            return res.pay(404).json({ success: false, message: 'pay not found' });
        }

        console.log("pay Details Fetched");
        res.json({
            success: true,
            pay: pay
        });
    } catch (error) {
        console.error("Error fetching pay details:", error);
        res.pay(500).json({ success: false, message: 'Error fetching pay details' });
    }
})

// Creating API for updating pay
app.put('/updatepay/:id', async (req, res) => {
    try {
        const payId = req.params.id;
        const updates = req.body;

        const pay = await Pay.findOne({ id: payId });

        if (!pay) {
            return res.pay(404).json({ success: false, message: 'pay not found' });
        }

        // Update category fields based on request body
        Object.keys(updates).forEach(key => {
            pay[key] = updates[key];
        });

        await pay.save();

        console.log("pay Updated");
        res.json({
            success: true,
            message: 'pay updated successfully',
            pay: pay
        });
    } catch (error) {
        console.error("Error updating pay:", error);
        res.pay(500).json({ success: false, message: 'Error updating pay' });
    }
})

// Creating API for getting all pays
app.get('/allpays', async (req, res) => {
    let pays = await Pay.find({});
    console.log("All pays Fetch");
    res.send(pays);
})



// Schema for Creating Orders
const Orders = mongoose.model('Orders', {
    userData: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    deliveryData: [{
        name: {
            type: String,
            default: '',
        },
        email: {
            type: String,
            default: '',
        },
        address: {
            type: String,
            default: '',
        },
        phone: {
            type: String,
            default: '',
        },
        city: {
            type: String,
            default: '',
        },
        province: {
            type: String,
            default: '',
        },
        district: {
            type: String,
            default: '',
        },
        commune: {
            type: String,
            default: '',
        },
        country: {
            type: String,
            default: '',
        },
    }],
    productData: [{
        type: Object,
        required: true,
    }],
    status: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Status',
    },
    quantity: {
        type: Number,
        default: 0,
        required: true,
    },
    total: {
        type: Number,
        default: 0,
        required: true,
    },
    payment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment',
    },
    pay: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pay',
    },
    date: {
        type: Date,
        default: Date.now,
    }
})

// Creating API for getting orders details
app.get('/detailsorder/:id', async (req, res) => {
    try {
        const orderId = req.params.id;

        const order = await Orders.findOne({ _id: orderId });

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        console.log("Order Details Fetched");
        res.json({
            success: true,
            order: order
        });
    } catch (error) {
        console.error("Error fetching order details:", error);
        res.status(500).json({ success: false, message: 'Error fetching order details' });
    }
})

// Creating API for addorder
app.post('/addorder', async (req, res) => {
    try {
        const userId = req.body.userId; // Lấy userId từ req.body
        const user = await Users.findOne({ _id: userId });
        const status = await Status.findOne({ name: 'Processing' })

        // Tạo đơn hàng mới
        const order = new Orders({
            userData: userId,
            deliveryData: req.body.deliveryInfo,
            productData: req.body.products,
            quantity: req.body.quantity,
            total: req.body.total,
            status: status,
            payment: req.body.payment,
            pay: req.body.pay,
        });

        // Lưu đơn hàng vào cơ sở dữ liệu
        await order.save();

        // Xóa các sản phẩm đã checkout khỏi giỏ hàng của người dùng
        for (const productId of Object.keys(req.body.products)) {
            delete user.cartData[productId];
        }
        await Users.findOneAndUpdate({ _id: userId }, { cartData: user.cartData });

        res.json({ success: true, message: 'Checkout successful', orderId: order._id });
    } catch (error) {
        console.error('Error during checkout:', error);
        res.status(500).json({ success: false, message: 'Error during checkout' });
    }
});

// Endpoint API để cập nhật trạng thái đơn hàng
app.put('/updateorderstatus/:orderId', async (req, res) => {
    const { orderId } = req.params;
    const { status: newStatusId } = req.body; // Extract the new status ID
  
    try {
      const updatedOrder = await Orders.findByIdAndUpdate(orderId, { status: newStatusId }, { new: true });
      res.json(updatedOrder);
    } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({ error: 'Server error' });
    }
});

// Creating API for deleting order
app.post('/removeorder', async (req, res) => {
    try {
        const orderId = req.body._id;

        // Sau đó xóa danh mục
        await Orders.findOneAndDelete({ _id: orderId });

        console.log("order removed");
        res.json({
            success: true,
            orderId: orderId,
        });
    } catch (error) {
        console.error("Error removing order:", error);
        res.order(500).json({ success: false, message: 'Error removing order' });
    }
})


// Creating API for get all orders
app.get('/allorders', async (req, res) => {
    let orders = await Orders.find({});
    console.log("All Users Fetch");
    res.send(orders);
})

app.listen(port, (error) => {
    if (!error) {
        console.log('Server Running on Port ' + port);
    }
    else {
        console.log('Error: ' + error);
    }
})