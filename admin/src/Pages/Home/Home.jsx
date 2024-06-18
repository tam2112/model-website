import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom'
import { Tooltip } from 'react-tooltip';
import CountUp from 'react-countup';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useTranslation } from "react-i18next";

import { BsBoxSeam, BsCurrencyDollar } from 'react-icons/bs';
import { GoDotFill } from 'react-icons/go';
import { MdOutlineSupervisorAccount } from 'react-icons/md';
import { FiBarChart } from 'react-icons/fi';
import { HiOutlineRefresh } from 'react-icons/hi';

import { SparklineAreaData } from '../../assets/dummy';
import { Stacked, Pie, SparkLine } from '../../components';

const Home = ({ showSidebar }) => {
    const { t, i18n } = useTranslation();

    useEffect(() => {
        window.document.title = t('home')
    }, [i18n.language])

    const [allUsers, setAllUsers] = useState([])
    const [allProducts, setAllProducts] = useState([])
    const [allCategories, setAllCategories] = useState([])
    const [allSizes, setAllSizes] = useState([])
    const [allStatus, setAllStatus] = useState([])
    const [allOrders, setAllOrders] = useState([])

    const fetchAllUsers = async () => {
        try {
            const response = await fetch('http://localhost:5000/allusers');
            const data = await response.json();
            setAllUsers(data);
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    }

    const fetchAllProducts = async () => {
        try {
            const response = await fetch('http://localhost:5000/allproducts');
            const data = await response.json();
            setAllProducts(data);
        } catch (error) {
            console.error('Error fetching product:', error);
        }
    }

    const fetchAllCategories = async () => {
        try {
            const response = await fetch('http://localhost:5000/allcategories');
            const data = await response.json();
            setAllCategories(data);
        } catch (error) {
            console.error('Error fetching category:', error);
        }
    }

    const fetchAllSizes = async () => {
        try {
            const response = await fetch('http://localhost:5000/allsizes');
            const data = await response.json();
            setAllSizes(data);
        } catch (error) {
            console.error('Error fetching size:', error);
        }
    }

    const fetchAllStatus = async () => {
        try {
            const response = await fetch('http://localhost:5000/allstatus');
            const data = await response.json();
            setAllStatus(data);
        } catch (error) {
            console.error('Error fetching status:', error);
        }
    }

    const fetchAllOrders = async () => {
        try {
            const response = await fetch('http://localhost:5000/allorders');
            const data = await response.json();
            setAllOrders(data);
        } catch (error) {
            console.error('Error fetching order:', error);
        }
    }

    useEffect(() => {
        fetchAllUsers();
        fetchAllOrders();
        fetchAllProducts();
        fetchAllSizes();
        fetchAllStatus();
        fetchAllCategories();
    }, [])

    const getSizeName = (sizeId) => {
        const size = allSizes.find(size => size._id === sizeId)
        return size ? size.name : ''
    }

    const getStatusName = (statusId) => {
        const status = allStatus.find(status => status._id === statusId)
        return status ? status.name : ''
    }

    const getProductName = (productId) => {
        const product = allProducts.find(product => product.id === productId)
        return product ? product.name : ''
    }

    const getCategoryName = (categoryId) => {
        const category = allCategories.find(category => category._id === categoryId)
        return category ? category.name : ''
    }

    const allProductSizes = allProducts.flatMap(p => p.sizes);
    const totalProducts = allProductSizes.reduce((pv, cur) => pv + cur.quantity, 0);

    const totalAmount = allOrders
        .filter(order => getStatusName(order.status) !== 'Cancelled' && getStatusName(order.status) === 'Delivered')
        .reduce((pv, cur) => pv + cur.total, 0)
        .toFixed(2);

    const totalQuantityAllOrders = allOrders.filter(order => getStatusName(order.status) !== 'Cancelled').reduce((total, order) => {
        // Lặp qua từng sản phẩm trong productData của đơn hàng
        const orderQuantity = order.productData.reduce((subTotal, product) => {
            // Lặp qua từng sản phẩm cụ thể trong product
            for (const productId in product) {
                if (product.hasOwnProperty(productId)) {
                    subTotal += product[productId].quantity;
                }
            }
            return subTotal;
        }, 0);
        return total + orderQuantity;
    }, 0);

    const totalOrderHasPayment = () => {
        const filteredOrders = allOrders.filter(order => order.payment && getStatusName(order.status) === 'Cancelled');
        const totalProducts = filteredOrders.reduce((total, order) => {
            return total + order.productData.reduce((orderTotal, productGroup) => {
                return orderTotal + Object.values(productGroup).reduce((groupTotal, product) => groupTotal + product.quantity, 0);
            }, 0);
        }, 0);
        return totalProducts;
    };

    const handleDownloadEarning = () => {
        const doc = new jsPDF();
    
        // Set up the PDF document
        doc.setFontSize(14);
        doc.text('All Orders', 10, 10);
    
        const headers = [['No', 'Delivery', 'Product', 'Order']];
    
        const data = allOrders.filter(order => getStatusName(order.status) !== 'Cancelled' && getStatusName(order.status) === 'Delivered').map((order, index) => {
            const deliveryInfo = order.deliveryData.map((item, index) => (
                `Name: ${item.name}\nEmail: ${item.email}\nAddress: ${item.address}\nPhone: ${item.phone}\nCity: ${item.city}\nProvince: ${item.province}\nDistrict: ${item.district}\nCommune: ${item.commune}\nCountry: ${item.country}`
            )).join('\n\n');
    
            const productInfo = order.productData.map((item, index) => {
                return Object.keys(item).map((productId, index) => (
                    `${index + 1}.\n   Name: ${getProductName(Number(productId))}\n   Size: ${getSizeName(item[productId].size)}\n   Price: $${item[productId].price}\n   Quantity: ${item[productId].quantity}`
                )).join('\n');
            }).join('\n\n');
    
            const orderInfo = (
                `Status: ${getStatusName(order.status)}\nQuantity: ${order.quantity}\nTotal: $${order.total.toFixed(2)}\nDate: ${new Date(order.date).toLocaleDateString()}`
            );
    
            return [(index + 1).toString(), deliveryInfo, productInfo, orderInfo];
        });
    
        doc.autoTable({
            head: headers,
            body: data,
            startY: 20,
            styles: { fontSize: 10 },
            columnStyles: {
                0: { cellWidth: 10 },
                1: { cellWidth: 60 },
                2: { cellWidth: 60 },
                3: { cellWidth: 60 },
            },
        });
    
        // Save the PDF
        doc.save('all_orders.pdf');
    };

    const handleDownloadCustomers = () => {
        const doc = new jsPDF();
    
        // Set up the PDF document
        doc.setFontSize(14);
        doc.text('All Customers', 10, 10);
    
        const headers = [['No', 'Account', 'Info', 'Address']];
    
        const data = allUsers.map((user, index) => {
            const accountInfo = (
                `Email: ${user.email}\nPassword: ${user.password}\nDate created: ${new Date(user.date).toLocaleDateString()}`
            );

            const personalInfo = (
                `Name: ${user.name}\nGender: ${user.gender}\nBirthday: ${user.birthday}\n`
            );
    
            const addressInfo = (
                `Address: ${user.address}\nPhone: ${user.phone}\nCity: ${user.city}\nProvince: ${user.province}\nDistrict: ${user.district}\nCommune: ${user.commune}\nCountry: ${user.country}`
            );
    
            return [(index + 1).toString(), accountInfo, personalInfo, addressInfo];
        });
    
        doc.autoTable({
            head: headers,
            body: data,
            startY: 20,
            styles: { fontSize: 10 },
            columnStyles: {
                0: { cellWidth: 10 },
                1: { cellWidth: 60 },
                2: { cellWidth: 60 },
                3: { cellWidth: 60 },
            },
        });
    
        // Save the PDF
        doc.save('all_customers.pdf');
    };

    const handleDownloadProducts = () => {
        const doc = new jsPDF();
    
        // Set up the PDF document
        doc.setFontSize(14);
        doc.text('All Products', 10, 10);
    
        const headers = [['No', 'Info', 'Quantity']];
    
        const data = allProducts.map((product, index) => {
            const productInfo = (
                `Name: ${product.name}\nCategory: ${getCategoryName(product.category)}\nPrice: ${product.price}\nDate created: ${new Date(product.date).toLocaleDateString()}`
            );

            const quantityInfo = product.sizes.map((item, index) => (
                `${index + 1}.\n   Size: ${getSizeName(item.size)}\n   Quantity: ${item.quantity}`
            )).join('\n\n');
    
            return [(index + 1).toString(), productInfo, quantityInfo];
        });
    
        doc.autoTable({
            head: headers,
            body: data,
            startY: 20,
            styles: { fontSize: 10 },
            columnStyles: {
                0: { cellWidth: 30 },
                1: { cellWidth: 80 },
                2: { cellWidth: 80 },
            },
        });
    
        // Save the PDF
        doc.save('all_products.pdf');
    };

    const handleDownloadSales = () => {
        const doc = new jsPDF();
    
        // Set up the PDF document
        doc.setFontSize(14);
        doc.text('All Products', 10, 10);
    
        const headers = [['No', 'Product Info', 'Order Info']];
    
        const data = allOrders.filter(order => getStatusName(order.status) !== 'Cancelled').map((order, index) => {
            const productInfo = order.productData.map((item, index) => {
                return Object.keys(item).map((productId, index) => (
                    `${index + 1}.\n   Name: ${getProductName(Number(productId))}\n   Size: ${getSizeName(item[productId].size)}\n   Price: $${item[productId].price}\n   Quantity: ${item[productId].quantity}`
                )).join('\n');
            }).join('\n\n');

            const orderInfo = (
                `Status: ${getStatusName(order.status)}\nQuantity: ${order.quantity}\nTotal: $${order.total.toFixed(2)}\nDate: ${new Date(order.date).toLocaleDateString()}`
            );
    
            return [(index + 1).toString(), productInfo, orderInfo];
        });
    
        doc.autoTable({
            head: headers,
            body: data,
            startY: 20,
            styles: { fontSize: 10 },
            columnStyles: {
                0: { cellWidth: 30 },
                1: { cellWidth: 80 },
                2: { cellWidth: 80 },
            },
        });
    
        // Save the PDF
        doc.save('all_products_has_ordered.pdf');
    };

    const handleDownloadRefunds = () => {
        const doc = new jsPDF();
    
        // Set up the PDF document
        doc.setFontSize(14);
        doc.text('All Products', 10, 10);
    
        const headers = [['No', 'Product Info', 'Order Info']];
    
        const data = allOrders.filter(order => order.payment && getStatusName(order.status) === 'Cancelled').map((order, index) => {
            const productInfo = order.productData.map((item, index) => {
                return Object.keys(item).map((productId, index) => (
                    `${index + 1}.\n   Name: ${getProductName(Number(productId))}\n   Size: ${getSizeName(item[productId].size)}\n   Price: $${item[productId].price}\n   Quantity: ${item[productId].quantity}`
                )).join('\n');
            }).join('\n\n');

            const orderInfo = (
                `Status: ${getStatusName(order.status)}\nQuantity: ${order.quantity}\nTotal: $${order.total.toFixed(2)}\nDate: ${new Date(order.date).toLocaleDateString()}`
            );
    
            return [(index + 1).toString(), productInfo, orderInfo];
        });
    
        doc.autoTable({
            head: headers,
            body: data,
            startY: 20,
            styles: { fontSize: 10 },
            columnStyles: {
                0: { cellWidth: 30 },
                1: { cellWidth: 80 },
                2: { cellWidth: 80 },
            },
        });
    
        // Save the PDF
        doc.save('all_products_has_cancelled.pdf');
    };

    const earningData = [
        {
            link: '/listcustomer',
            icon: <MdOutlineSupervisorAccount />,
            anchorId: 'customer',
            amount: allUsers.length,
            percentage: '-4%',
            title: t('customers'),
            iconColor: '#03C9D7',
            iconBg: '#E5FAFB',
            pcColor: 'red-600',
            handleDownload: handleDownloadCustomers,
        },
        {
            link: '/listproduct',
            icon: <BsBoxSeam />,
            anchorId: 'product',
            amount: totalProducts,
            percentage: '+23%',
            title: t('products'),
            iconColor: 'rgb(255, 244, 229)',
            iconBg: 'rgb(254, 201, 15)',
            pcColor: 'green-600',
            handleDownload: handleDownloadProducts,
        },
        {
            link: '/listorder',
            icon: <FiBarChart />,
            anchorId: 'sale',
            amount: totalQuantityAllOrders,
            percentage: '+38%',
            title: t('sales'),
            iconColor: 'rgb(228, 106, 118)',
            iconBg: 'rgb(255, 244, 229)',
            pcColor: 'green-600',
            handleDownload: handleDownloadSales,
        },
        {
            link: '/listorder',
            icon: <HiOutlineRefresh />,
            anchorId: 'refund',
            amount: totalOrderHasPayment(),
            percentage: '-12%',
            title: t('refunds'),
            iconColor: 'rgb(0, 194, 146)',
            iconBg: 'rgb(235, 250, 242)',
            pcColor: 'red-600',
            handleDownload: handleDownloadRefunds,
        },
    ];

    return (
        <>
            <div className={`${showSidebar ? 'lg:ml-[300px] ml-0' : 'ml-0'}`}>
                <div className="mt-4 sm:ml-6 ml-0">
                    <div className="flex flex-wrap lg:flex-nowrap justify-center">
                        <div className="bg-white dark:text-gray-200 dark:bg-light-gray h-44 rounded-xl w-full lg:w-80 p-8 pt-9 m-3 mt-4 bg-[url('https://media3.giphy.com/media/wjjvv8CEWSdAcdlgtP/200.webp?cid=ecf05e47wm1pr6wxcpyolz7javuxqm4k820yuetpcb8e42yo&ep=v1_gifs_search&rid=200.webp&ct=g')] bg-no-repeat bg-cover bg-center">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-gray-400">{t('earnings')}</p>
                                    <CountUp end={totalAmount} duration={2} prefix='$' decimals={2} className='text-2xl text-white' />
                                </div>
                            </div>
                            <div className="mt-6">
                                <button onClick={handleDownloadEarning} className='btn-primary bg-white rounded-md'>{t('download')}</button>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 m-4">
                            {earningData.map((item) => (
                                <div
                                    key={item.title}
                                    className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-4 pt-9 rounded-2xl md:w-56"
                                >
                                    <Link to={item.link}>
                                        <button
                                            id={item.anchorId}
                                            type="button"
                                            style={{ color: item.iconColor, backgroundColor: item.iconBg }}
                                            className="text-2xl opacity-70 rounded-full p-4 hover:drop-shadow-xl"
                                        >
                                            {item.icon}
                                        </button>
                                        <Tooltip anchorId={item.anchorId} place="right" content={t('explore now')} />
                                    </Link>
                                    <div className='flex items-center justify-between'>
                                        <div>
                                            <p className="mt-3">
                                                <CountUp end={item.amount} duration={1} className='text-lg font-semibold' />
                                                <span className={`text-sm text-${item.pcColor} ml-2`}>{item.percentage}</span>
                                            </p>
                                            <p className="text-sm text-gray-400 mt-1">{item.title}</p>
                                        </div>
                                        <div>
                                            <button
                                                onClick={item.handleDownload}
                                                type="button"
                                                style={{ color: item.iconColor, backgroundColor: item.iconBg }}
                                                className="opacity-90 rounded-md p-2 px-3 hover:drop-shadow-xl"
                                            >
                                                {t('download')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
        
                    <div className="flex gap-10 flex-wrap justify-center">
                        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg m-3 p-4 rounded-2xl md:w-780">
                            <div className="flex justify-between">
                                <p className="font-semibold text-xl">{t('revenue update')}</p>
                                <div className="flex items-center gap-4">
                                    <p className="flex items-center text-gray-600 hover:drop-shadow-xl">
                                        <span>
                                            <GoDotFill />
                                        </span>
                                        <span>{t('expense')}</span>
                                    </p>
                                    <p className="flex items-center text-green-400 hover:drop-shadow-xl">
                                        <span>
                                            <GoDotFill />
                                        </span>
                                        <span>{t('budget')}</span>
                                    </p>
                                </div>
                            </div>
                            <div className="mt-10 flex gap-10 flex-wrap justify-center">
                                <div className="border-r-1 border-color m-4 pr-10">
                                    <div>
                                        <p>
                                            <span className="text-3xl font-semibold">$93,438</span>
                                            <span className="p-1.5 hover:drop-shadow-xl cursor-pointer rounded-full text-white bg-green-400 ml-3 text-xs">
                                                23%
                                            </span>
                                        </p>
                                        <p className="text-gray-500 mt-1">{t('budget')}</p>
                                    </div>
                                    <div className="mt-8">
                                        <p>
                                            <span className="text-3xl font-semibold">$48,438</span>
                                        </p>
                                        <p className="text-gray-500 mt-1">{t('expense')}</p>
                                    </div>
        
                                    <div className="mt-5">
                                        <SparkLine
                                            id="line-sparkline"
                                            type="Line"
                                            height="80px"
                                            width="250px"
                                            data={SparklineAreaData}
                                        />
                                    </div>
        
                                    <div className="mt-10">
                                        <button className='btn-primary bg-white rounded-md px-8'>{t('download report')}</button>
                                    </div>
                                </div>
                                <div>
                                    <Stacked width="320px" height="360px" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
