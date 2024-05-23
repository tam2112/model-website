import { Route, Routes } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import { AddProduct, ListProduct, DetailsProduct, UpdateProduct, RestoreProduct } from '../../components/Product'
import { AddCategory, ListCategory, DetailsCategory, UpdateCategory, RestoreCategory } from '../../components/Category'
import { AddSize, ListSize, DetailsSize, UpdateSize, RestoreSize } from '../../components/Size'
import { AddStatus, ListStatus, DetailsStatus, UpdateStatus, RestoreStatus } from '../../components/Status'
import { AddPayment, ListPayment, DetailsPayment, UpdatePayment, RestorePayment } from '../../components/Payment'
import { AddPay, ListPay, DetailsPay, UpdatePay, RestorePay } from '../../components/Pay'
import { ListCustomer, DetailsCustomer } from '../../components/Customer'
import { ListOrder, DetailsOrder } from '../../components/Order'
import Home from '../Home/Home'
import { Calendar, Stacked, Pyramid, Kanban, Line, Area, Bar, Pie, Financial, ColorPicker, ColorMapping, Editor } from '../../Pages';

const Admin = ({ showSidebar }) => {
    return (
        <>
            <div>
                <Sidebar showSidebar={showSidebar} />
                <Routes>
                    <Route path="/" element={<Home showSidebar={showSidebar} />} />

                    {/* Product */}
                    <Route path="/listproduct" element={<ListProduct showSidebar={showSidebar} />} />
                    <Route path="/addproduct" element={<AddProduct showSidebar={showSidebar} />} />
                    <Route path="/updateproduct/:id" element={<UpdateProduct showSidebar={showSidebar} />} />
                    <Route path="/detailsproduct/:id" element={<DetailsProduct showSidebar={showSidebar} />} />
                    <Route path="/restoreproduct" element={<RestoreProduct showSidebar={showSidebar} />} />

                    {/* Category */}
                    <Route path="/listcategory" element={<ListCategory showSidebar={showSidebar} />} />
                    <Route path="/addcategory" element={<AddCategory showSidebar={showSidebar} />} />
                    <Route path="/updatecategory/:id" element={<UpdateCategory showSidebar={showSidebar} />} />
                    <Route path="/detailscategory/:id" element={<DetailsCategory showSidebar={showSidebar} />} />
                    <Route path="/restorecategory" element={<RestoreCategory showSidebar={showSidebar} />} />

                    {/* Size */}
                    <Route path="/listsize" element={<ListSize showSidebar={showSidebar} />} />
                    <Route path="/addsize" element={<AddSize showSidebar={showSidebar} />} />
                    <Route path="/updatesize/:id" element={<UpdateSize showSidebar={showSidebar} />} />
                    <Route path="/detailssize/:id" element={<DetailsSize showSidebar={showSidebar} />} />
                    <Route path="/restoresize" element={<RestoreSize showSidebar={showSidebar} />} />

                    {/* Status */}
                    <Route path="/liststatus" element={<ListStatus showSidebar={showSidebar} />} />
                    <Route path="/addstatus" element={<AddStatus showSidebar={showSidebar} />} />
                    <Route path="/updatestatus/:id" element={<UpdateStatus showSidebar={showSidebar} />} />
                    <Route path="/detailsstatus/:id" element={<DetailsStatus showSidebar={showSidebar} />} />
                    <Route path="/restorestatus" element={<RestoreStatus showSidebar={showSidebar} />} />

                    {/* Payment */}
                    <Route path="/listpayment" element={<ListPayment showSidebar={showSidebar} />} />
                    <Route path="/addpayment" element={<AddPayment showSidebar={showSidebar} />} />
                    <Route path="/updatepayment/:id" element={<UpdatePayment showSidebar={showSidebar} />} />
                    <Route path="/detailspayment/:id" element={<DetailsPayment showSidebar={showSidebar} />} />
                    <Route path="/restorepayment" element={<RestorePayment showSidebar={showSidebar} />} />

                    {/* Pay */}
                    <Route path="/listpay" element={<ListPay showSidebar={showSidebar} />} />
                    <Route path="/addpay" element={<AddPay showSidebar={showSidebar} />} />
                    <Route path="/updatepay/:id" element={<UpdatePay showSidebar={showSidebar} />} />
                    <Route path="/detailspay/:id" element={<DetailsPay showSidebar={showSidebar} />} />
                    <Route path="/restorepay" element={<RestorePay showSidebar={showSidebar} />} />

                    {/* Customers */}
                    <Route path="/listcustomer" element={<ListCustomer showSidebar={showSidebar} />} />
                    <Route path="/detailsuser/:id" element={<DetailsCustomer showSidebar={showSidebar} />} />

                    {/* Orders */}
                    <Route path="/listorder" element={<ListOrder showSidebar={showSidebar} />} />
                    <Route path="/detailsorder/:id" element={<DetailsOrder showSidebar={showSidebar} />} />

                    {/* apps  */}
                    <Route path="/kanban" element={<Kanban showSidebar={showSidebar} />} />
                    <Route path="/editor" element={<Editor showSidebar={showSidebar} />} />
                    <Route path="/calendar" element={<Calendar showSidebar={showSidebar} />} />
                    <Route path="/color-picker" element={<ColorPicker showSidebar={showSidebar} />} />

                    {/* charts  */}
                    <Route path="/line" element={<Line showSidebar={showSidebar} />} />
                    <Route path="/area" element={<Area showSidebar={showSidebar} />} />
                    <Route path="/bar" element={<Bar showSidebar={showSidebar} />} />
                    <Route path="/pie" element={<Pie showSidebar={showSidebar} />} />
                    <Route path="/financial" element={<Financial showSidebar={showSidebar} />} />
                    <Route path="/color-mapping" element={<ColorMapping showSidebar={showSidebar} />} />
                    <Route path="/pyramid" element={<Pyramid showSidebar={showSidebar} />} />
                    <Route path="/stacked" element={<Stacked showSidebar={showSidebar} />} />
                </Routes>
            </div>
        </>
    );
}

export default Admin