// Containers
import FullLayout from "./components/Layout/";
import Layout from "./components/Layout1/";
import Submenu from "./components/Submenu";
// Pages
import Login from "./containers/Pages/Login/";
import Page404 from "./containers/Pages/Page404/";
//Center name master
import Centername from "./containers/Centername";
import AddEditCenter from "./containers/Centername/add_edit";
//Office Space master
import Officespace from "./containers/Officespace";
import AddEditSpace from "./containers/Officespace/add_edit";
//Office Type master
import Officetype from "./containers/Officetype";
import AddEditType from "./containers/Officetype/add_edit";
//Office Category master
import Officecategory from "./containers/Officecategory";
import AddEditCategory from "./containers/Officecategory/add_edit";
//Package
import Package from "./containers/Package";
import AddEditPackage from "./containers/Package/add_edit";
//Service
import Service from "./containers/Service";
import AddEditService from "./containers/Service/add_edit";
//Leads
import Leads from "./containers/Leads";
import AddEditLeads from "./containers/Leads/add_edit";
import Leadupdate from "./containers/Leads/leadupdate";
//Customer
import Customer from "./containers/Customer";
import customerList from "./containers/Customer/customerList";
import customerListInactive from "./containers/Customer/viewInactive";
import customerSetting from "./containers/Customer/customerSetting";
import clientAddEdit from "./containers/Customer/clientAddEdit";
import clientSetting from "./containers/Customer/clientSetting";
import companySetting from "./containers/Customer/companySetting";
import paymentSetting from "./containers/Customer/paymentSetting";
import financeSetting from "./containers/Customer/financeSetting";

import extensionSetting from "./containers/Customer/extensionSetting";
import renewalSetting from "./containers/Customer/renewalSetting";
import terminateSetting from "./containers/Customer/terminateSetting";

import uploadDocumentSetting from "./containers/Customer/uploaddocumentSetting";
//Menu
import Menu from "./containers/Menu";
import AddEditMenu from "./containers/Menu/add_edit";
//Roles & permission
import Roles from "./containers/Roles";
import AddEditRoles from "./containers/Roles/add_edit";
//Business
import Business from "./containers/Business";
import AddEditBusiness from "./containers/Business/add_edit";
//Users
import Users from "./containers/Users";
import AddEditUsers from "./containers/Users/add_edit";
//Language
import Language from "./containers/Language";
import AddEditLanguage from "./containers/Language/add_edit";
//Language
import Label from "./containers/Label";
import AddEditLabel from "./containers/Label/add_edit";
//Amenities
import Amenities from "./containers/Amenities";
import AddEditAmenities from "./containers/Amenities/add_edit";
//GST
import Gst from "./containers/Gst";
import AddEditGst from "./containers/Gst/add_edit";
//Service Allocation
import ServiceType from "./containers/Serviceallocation/servicetype";
import AddEditServiceType from "./containers/Serviceallocation/add_edit";
import Allocation from "./containers/Serviceallocation/allocation";
import Customer_list from "./containers/Serviceallocation/customer_list";
import Employee_list from "./containers/Serviceallocation/employee_list";
import SpcaeAllocation from "./containers/Serviceallocation/space";
//Service Category
import Servicecategory from "./containers/Servicecategory";
import AddEditServicecategory from "./containers/Servicecategory/add_edit";

//AccountType
import Accounttype from "./containers/Accounttype";
import AddEditAccounttype from "./containers/Accounttype/add_edit";

//Payment
import Payment from "./containers/Payment";
import AddEditPayment from "./containers/Payment/add_edit";

//Leadsource
import Leadsource from "./containers/Leadsource";
import AddEditLeadsource from "./containers/Leadsource/add_edit";

//KYCMaster
import KYC from "./containers/KYC";
import AddEditKYC from "./containers/KYC/add_edit";

//UnitMaster
import Unit from "./containers/Unit";
import AddEditUnit from "./containers/Unit/add_edit";

//CountryMaster
import Country from "./containers/Country";
import AddEditCountry from "./containers/Country/add_edit";

//ProductMaster
import Product from "./containers/Product";
import AddEditProduct from "./containers/Product/add_edit";

//StateMaster
import State from "./containers/State";
import AddEditState from "./containers/State/add_edit";

//CityMaster
import City from "./containers/City";
import AddEditCity from "./containers/City/add_edit";

//PincodeMaster
import Pincode from "./containers/Pincode";
import AddEditPincode from "./containers/Pincode/add_edit";

//AccountheadMaster
import Accounthead from "./containers/Accounthead";
import AddEditAccounthead from "./containers/Accounthead/add_edit";

//AccountheadMaster
import Ledger from "./containers/Ledger";
import AddEditLedger from "./containers/Ledger/add_edit";

//AccountheadMaster
import Agreement from "./containers/Agreement";
import AddEditAgreement from "./containers/Agreement/add_edit";

//Invoice
import Invoice from "./containers/Invoice";
import AddEditInvoice from "./containers/Invoice/add_edit";

import AddEditGroupbilling from "./containers/Groupbilling/add_edit";

//proform bill posting
import ProformaBillPosting from "./containers/ProformaPosting/add_edit";

//proforma Bill create
import AddEditproformaBilling from "./containers/ProformaBilling/add_edit";

//proforma Invoice
import proformaInvoice from "./containers/ProformaInvoice";
import AddEditproformaInvoice from "./containers/ProformaInvoice/add_edit";

//Receipt
import Receipt from "./containers/Receipt";
import AddEditReceipt from "./containers/Receipt/add_edit";

//Credit note
import CreditNote from "./containers/CreditNote";
import AddEditCreditNote from "./containers/CreditNote/add_edit";

//Area/FloorMaster
import AreaMaster from "./containers/Area";
import AddEditAreaMaster from "./containers/Area/add_edit";

//RoomMaster
import RoomMaster from "./containers/Room";
import AddEditRoomMaster from "./containers/Room/add_edit";

//Tally export
import TallyExport from "./containers/TallyExport";

import Feedback from "./containers/Feedback";
import AddEditFeedback from "./containers/Feedback/add_edit";

//External Customer
import ExternalCustomer from "./containers/ExternalCustomer";
import AddEditExternalCustomer from "./containers/ExternalCustomer/add_edit";

import ExternalCustomerBilling from "./containers/ExternalCustomerBilling/add_edit";

import TemplateCategory from "./containers/Templatecategory";
import AddEditTemplateCategory from "./containers/Templatecategory/add_edit";

import TemplateMaster from "./containers/Templatemaster";
import AddEditTemplateMaster from "./containers/Templatemaster/add_edit";

import Notification from "./containers/Notification";
import AddEditNotification from "./containers/Notification/add_edit";
//Reports
import TotalServiceInvoiced from "./components/Reports/totalServiceInvoiced";
import ClientDetailsListing from "./components/Reports/clientDetailsListing";
import CustomerOverrides from "./components/Reports/customerOverrides";
import DailyActivityReportInv from "./components/Reports/dailyActivityReportInv";
import DailyActivityReportUninv from "./components/Reports/dailyActivityReportUninv";
import InvoiceListing from "./components/Reports/invoiceListing";
import OfficeExpriationReport from "./components/Reports/officeExpriationReport";
import TotalServiceUninvoiced from "./components/Reports/proformareport";
import ReceiptListing from "./components/Reports/receiptListing";
import AgeingReport from "./components/Reports/ageingReport";

import CustomerwiseAgeingReport from "./components/Reports/clientAgeingReport";

import ConsolidateAgeingReport from "./components/Reports/consolidateAgeingReport";
import OfficeOccupancyReport from "./components/Reports/officeOccupancyReport";
import SOAReport from "./components/Reports/soaReport";

export default {
  childRoutes: [
    {
      path: "/",
      component: FullLayout,
      indexRoute: { component: Leads, name: "Leads" },
      name: "Home",
      childRoutes: [
        {
          path: "/dashboard/",
          name: "Dashboard",
          indexRoute: { component: Submenu }
          /*childRoutes: [{
                            path:"leads",
                            component:Leads,
                            name:"Lead Status"
                          }]*/
        },
        {
          path: "/leads/",
          name: "Leads",
          indexRoute: { component: Submenu },
          childRoutes: [
            {
              path: "leads",
              component: Leads,
              name: "Lead Status"
            },
            {
              path: "enquiry",
              component: AddEditLeads,
              name: "Enquiry"
            },
            {
              path: "leadupdate/:id",
              component: Leadupdate,
              name: "Lead Status"
            },
            {
              path: "agreement",
              component: Agreement,
              name: "Agreement"
            },
            {
              path: "add-agreement",
              component: AddEditAgreement,
              name: "Add Agreement"
            },
            {
              path: "edit-agreement/:id",
              component: AddEditAgreement,
              name: "Edit Agreement"
            }
          ]
        },
        {
          path: "/customers/",
          name: "Customer",
          indexRoute: { component: Submenu },
          childRoutes: [
            {
              path: "client-setting/",
              name: "Client-Setting",
              indexRoute: { component: customerList },
              childRoutes: [
                {
                  path: "customer-setting",
                  component: customerSetting,
                  name: "Customer Setting"
                },
                {
                  path: "company-setting",
                  component: companySetting,
                  name: "Comapny Setting"
                },
                {
                  path: "client-setting",
                  component: clientSetting,
                  name: "View Client"
                },
                {
                  path: "add-client",
                  component: clientAddEdit,
                  name: "Add Client"
                },
                {
                  path: "edit-client/:id",
                  component: clientAddEdit,
                  name: "Edit Client"
                },
                {
                  path: "payment-setting",
                  component: paymentSetting,
                  name: "Payment Setting"
                },
                {
                  path: "uploaddocument-setting",
                  component: uploadDocumentSetting,
                  name: "Payment Setting"
                },
                {
                  path: "finance-setting",
                  component: financeSetting,
                  name: "Finance Setting"
                },
                {
                  path: "agreement-renewal",
                  component: renewalSetting,
                  name: "Renewal Setting"
                },
                {
                  path: "agreement-extension",
                  component: extensionSetting,
                  name: "Extension Setting"
                },
                {
                  path: "terminate-unit",
                  component: terminateSetting,
                  name: "Terminate Setting"
                },
                {
                  path: "externalcustomer",
                  component: ExternalCustomer,
                  name: "External Customer"
                },
                {
                  path: "add-externalcustomer",
                  component: AddEditExternalCustomer,
                  name: "Add External Customer"
                },
                {
                  path: "edit-externalcustomer/:id",
                  component: AddEditExternalCustomer,
                  name: "Edit External Customer"
                }
              ]
            },
            {
              path: "client-setting-inactive/",
              name: "Client-Setting-Inactive",
              indexRoute: { component: customerListInactive },
              childRoutes: [
                {
                  path: "customer-setting",
                  component: customerSetting,
                  name: "Customer Setting"
                },
                {
                  path: "company-setting",
                  component: companySetting,
                  name: "Comapny Setting"
                },
                {
                  path: "client-setting",
                  component: clientSetting,
                  name: "View Client"
                },
                {
                  path: "add-client",
                  component: clientAddEdit,
                  name: "Add Client"
                },
                {
                  path: "edit-client/:id",
                  component: clientAddEdit,
                  name: "Edit Client"
                },
                {
                  path: "payment-setting",
                  component: paymentSetting,
                  name: "Payment Setting"
                },
                {
                  path: "uploaddocument-setting",
                  component: uploadDocumentSetting,
                  name: "Payment Setting"
                },
                {
                  path: "finance-setting",
                  component: financeSetting,
                  name: "Finance Setting"
                },
                {
                  path: "agreement-renewal",
                  component: renewalSetting,
                  name: "Renewal Setting"
                },
                {
                  path: "agreement-extension",
                  component: extensionSetting,
                  name: "Extension Setting"
                },
                {
                  path: "terminate-unit",
                  component: terminateSetting,
                  name: "Terminate Setting"
                },
                {
                  path: "externalcustomer",
                  component: ExternalCustomer,
                  name: "External Customer"
                },
                {
                  path: "add-externalcustomer",
                  component: AddEditExternalCustomer,
                  name: "Add External Customer"
                },
                {
                  path: "edit-externalcustomer/:id",
                  component: AddEditExternalCustomer,
                  name: "Edit External Customer"
                }
              ]
            },
            {
              path: "serviceallocation/",
              name: "Service Alloaction",
              indexRoute: { component: Allocation },
              childRoutes: [
                {
                  path: "company-list/",
                  name: "Company List",
                  indexRoute: { component: Customer_list },
                  childRoutes: [
                    {
                      path: "employee-list/",
                      name: "Employee List",
                      indexRoute: { component: Employee_list },
                      childRoutes: [
                        {
                          path: "space-allocation/",
                          name: "Space Allocation",
                          indexRoute: { component: SpcaeAllocation },
                          childRoutes: [
                            {
                              path: "service-add",
                              name: "Add Service Type",
                              component: AddEditServiceType

                              /*path:"service-type/",
                                                            name:"Service Type",
                                                            indexRoute: { component:ServiceType}, 
                                                            childRoutes: [
                                                                       {
                                                                        path:"service-add",
                                                                        name:"Add Service Type",
                                                                        component:AddEditServiceType
                                                                      },
                                                                      {
                                                                        path:"service-edit/:id",
                                                                        name:"Edit Service Type",
                                                                        component:AddEditServiceType
                                                                      }
                                                                  ]*/
                            }
                            /*,                                                          
                                                          {
                                                            path:"booking",
                                                            component:conferenceBooking,
                                                            name:"Conference Booking" 
                                                          }
                                                          */
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              path: "feedback/",
              name: "Feedback",
              indexRoute: { component: Feedback },
              childRoutes: [
                {
                  path: "add-feedback",
                  component: AddEditFeedback,
                  name: "Add Feedback"
                },
                {
                  path: "edit-feedback/:id",
                  component: AddEditFeedback,
                  name: "Edit Feedback"
                }
              ]
            },
            {
              path: "notification/",
              name: "Notification",
              indexRoute: { component: Notification },
              childRoutes: [
                {
                  path: "add-notification",
                  component: AddEditNotification,
                  name: "Add Notification"
                },
                {
                  path: "edit-notification/:id",
                  component: AddEditNotification,
                  name: "Edit Notification"
                }
              ]
            }
          ]
        },
        {
          path: "/billing/",
          name: "Billing",
          indexRoute: { component: Submenu },
          childRoutes: [
            {
              path: "group-billing",
              component: AddEditGroupbilling,
              name: "Group Billing"
            },
            {
              path: "individual-billing",
              component: Service,
              name: "Individual Billing"
            },
            {
              path: "bill-posting",
              component: AddEditLeads,
              name: "Bill Posting"
            },
            {
              path: "receipt",
              component: Receipt,
              name: "Receipt"
            },
            {
              path: "add-receipt",
              component: AddEditReceipt,
              name: "Add Receipt"
            },
            {
              path: "edit-receipt/:id",
              component: AddEditReceipt,
              name: "Edit Receipt"
            },
            {
              path: "creditnote",
              component: CreditNote,
              name: "Credit Note"
            },
            {
              path: "add-creditnote",
              component: AddEditCreditNote,
              name: "Add Credit Note"
            },
            {
              path: "edit-creditnote/:id",
              component: AddEditCreditNote,
              name: "Edit Credit Note"
            },
            {
              path: "bill-reporting",
              component: Invoice,
              name: "Bill Report"
            },
            {
              path: "proformabill-reporting",
              component: proformaInvoice,
              name: "proforma Invoice"
            },
            {
              path: "externalcustomer",
              component: ExternalCustomerBilling,
              name: "External Customer Billing"
            },
            {
              path: "proforma-invoice/:id",
              component: AddEditproformaInvoice,
              name: "View proforma Invoice"
            },

            {
              path: "edit-invoice/:id",
              component: AddEditInvoice,
              name: "View Invoice"
            },
            {
              path: "tally-export",
              component: TallyExport,
              name: "Tally Export"
            }
          ]
        },
        {
          path: "/reports/",
          name: "Reports",
          indexRoute: { component: Submenu },
          childRoutes: [
            {
              path: "client-details-listing",
              component: ClientDetailsListing,
              name: "Client Details Listing"
            },
            {
              path: "customer-overrides",
              component: CustomerOverrides,
              name: "Customer Overrides"
            },
            {
              path: "daily-activity-report_inv",
              component: DailyActivityReportInv,
              name: "Daily Activity Report (Invoiced)"
            },
            {
              path: "daily-activity-report_uninv",
              component: DailyActivityReportUninv,
              name: "Daily Activity Report (Uninvoiced)"
            },
            {
              path: "invoice-listing",
              component: InvoiceListing,
              name: "Invoice Listing"
            },
            {
              path: "office-expriation-report",
              component: OfficeExpriationReport,
              name: "Office Expriation Report"
            },
            {
              path: "Office Occupancy",
              component: OfficeOccupancyReport,
              name: "Total Services (Invoiced)"
            },
            {
              path: "soa-report",
              component: SOAReport,
              name: "SOA report"
            },

            {
              path: "total-service-invoiced",
              component: TotalServiceInvoiced,
              name: "Total Services (Invoiced)"
            },
            {
              path: "total-service-uninvoiced-proforma",
              component: TotalServiceUninvoiced,
              name: "Total Services (Uninvoiced)"
            },
            {
              path: "receipt-listing",
              component: ReceiptListing,
              name: "Receipt Listing"
            },

            {
              path: "ageing-report",
              component: AgeingReport,
              name: "Ageing Report"
            },
            {
              path: "customer-ageing-report",
              component: CustomerwiseAgeingReport,
              name: "Customer Ageing Report"
            },
            {
              path: "consolidate-ageing-report",
              component: ConsolidateAgeingReport,
              name: "Consolidate Ageing Report"
            },
            {
              path: "office-occupancy-report",
              component: OfficeOccupancyReport,
              name: "Office Occupancy Report"
            }
          ]
        },
        {
          path: "/settings",
          name: "Settings",
          component: Submenu
        },
        {
          path: "/billing/proforma-billing-action/",
          name: "Proforma Billing",
          indexRoute: { component: Submenu },
          childRoutes: [
            {
              path: "create",
              component: AddEditproformaBilling,
              name: "Proforma Billing"
            },
            {
              path: "posting",
              component: ProformaBillPosting,
              name: "Proforma Bill Posting"
            }
          ]
        },
        {
          path: "/settings/accounts/",
          name: "Settings",
          indexRoute: { component: Submenu },
          childRoutes: [
            {
              path: "gst",
              component: Gst,
              name: "GST"
            },
            {
              path: "add-gst",
              component: AddEditGst,
              name: "Add GST"
            },
            {
              path: "edit-gst/:id",
              component: AddEditGst,
              name: "Edit GST"
            },

            {
              path: "accounttype",
              component: Accounttype,
              name: "Accounttype"
            },
            {
              path: "add-accounttype",
              component: AddEditAccounttype,
              name: "Add AccountType"
            },
            {
              path: "edit-accounttype/:id",
              component: AddEditAccounttype,
              name: "Edit AccountType"
            },

            {
              path: "kyc",
              component: KYC,
              name: "KYC"
            },
            {
              path: "add-kyc",
              component: AddEditKYC,
              name: "Add KYC"
            },
            {
              path: "edit-kyc/:id",
              component: AddEditKYC,
              name: "Edit KYC"
            },
            {
              path: "accounthead",
              component: Accounthead,
              name: "Account Head"
            },
            {
              path: "add-accounthead",
              component: AddEditAccounthead,
              name: "Add Account Head"
            },
            {
              path: "edit-accounthead/:id",
              component: AddEditAccounthead,
              name: "Edit Account Head"
            },
            {
              path: "ledger",
              component: Ledger,
              name: "Ledger"
            },
            {
              path: "add-ledger",
              component: AddEditLedger,
              name: "Add Ledger"
            },
            {
              path: "edit-ledger/:id",
              component: AddEditLedger,
              name: "Edit Ledger"
            },
            {
              path: "payment",
              component: Payment,
              name: "Payment"
            },
            {
              path: "add-payment",
              component: AddEditPayment,
              name: "Add Payment"
            },
            {
              path: "edit-payment/:id",
              component: AddEditPayment,
              name: "Edit Payment"
            }
          ]
        },
        {
          path: "/settings/general/",
          name: "Settings",
          indexRoute: { component: Submenu },
          childRoutes: [
            {
              path: "servicecategory",
              component: Servicecategory,
              name: "Service Category"
            },
            {
              path: "add-servicecategory",
              component: AddEditServicecategory,
              name: "Add Service Category"
            },
            {
              path: "edit-servicecategory/:id",
              component: AddEditServicecategory,
              name: "Edit Service Category"
            },
            {
              path: "gst",
              component: Gst,
              name: "GST"
            },
            {
              path: "add-gst",
              component: AddEditGst,
              name: "Add GST"
            },
            {
              path: "edit-gst/:id",
              component: AddEditGst,
              name: "Edit GST"
            },
            {
              path: "amenities",
              component: Amenities,
              name: "Amenities"
            },
            {
              path: "add-amenities",
              component: AddEditAmenities,
              name: "Add Amenities"
            },
            {
              path: "edit-amenities/:id",
              component: AddEditAmenities,
              name: "Edit Amenities"
            },
            {
              path: "users",
              component: Users,
              name: "Users"
            },
            {
              path: "add-users",
              component: AddEditUsers,
              name: "Add Users"
            },
            {
              path: "edit-users/:id",
              component: AddEditUsers,
              name: "Edit Users"
            },
            {
              path: "business",
              component: Business,
              name: "Business"
            },
            {
              path: "add-business",
              component: AddEditBusiness,
              name: "Add Business"
            },
            {
              path: "edit-business/:id",
              component: AddEditBusiness,
              name: "Edit Business"
            },

            {
              path: "roles",
              component: Roles,
              name: "Roles Name"
            },
            {
              path: "add-roles",
              component: AddEditRoles,
              name: "Add Roles"
            },
            {
              path: "edit-roles/:id",
              component: AddEditRoles,
              name: "Edit Roles"
            },

            {
              path: "menu",
              component: Menu,
              name: "Menu Name"
            },
            {
              path: "add-menu",
              component: AddEditMenu,
              name: "Add Menu"
            },
            {
              path: "edit-menu/:id",
              component: AddEditMenu,
              name: "Edit Menu"
            },

            {
              path: "centername",
              component: Centername,
              name: "Center Name"
            },
            {
              path: "add-center",
              component: AddEditCenter,
              name: "Add Center",
              link: "/centername"
            },
            {
              path: "edit-center/:c_id",
              component: AddEditCenter,
              name: "Edit Center",
              link: "/centername"
            },

            {
              path: "officespace",
              component: Officespace,
              name: "Office Space"
            },
            {
              path: "add-space",
              component: AddEditSpace,
              name: "Add Center",
              link: "/officespace"
            },
            {
              path: "edit-space/:id",
              component: AddEditSpace,
              name: "Edit Space",
              link: "/officespace"
            },

            {
              path: "officetype",
              component: Officetype,
              name: "Office Type"
            },
            {
              path: "add-type",
              component: AddEditType,
              name: "Add Type",
              link: "/officetype"
            },
            {
              path: "edit-type/:id",
              component: AddEditType,
              name: "Edit Type",
              link: "/officetype"
            },

            {
              path: "officecategory",
              component: Officecategory,
              name: "Category"
            },
            {
              path: "add-category",
              component: AddEditCategory,
              name: "Add Category",
              link: "/officecategory"
            },
            {
              path: "edit-category/:id",
              component: AddEditCategory,
              name: "Edit Category",
              link: "/officecategory"
            },

            {
              path: "package",
              component: Package,
              name: "Package"
            },
            {
              path: "add-package",
              component: AddEditPackage,
              name: "Add Package",
              link: "/package"
            },
            {
              path: "edit-package/:id",
              component: AddEditPackage,
              name: "Edit Package",
              link: "/package"
            },

            {
              path: "service",
              component: Service,
              name: "Service"
            },
            {
              path: "add-service",
              component: AddEditService,
              name: "Add Service",
              link: "/service"
            },
            {
              path: "edit-service/:id",
              component: AddEditService,
              name: "Edit Service",
              link: "/service"
            },

            {
              path: "language",
              component: Language,
              name: "Language"
            },
            {
              path: "add-language",
              component: AddEditLanguage,
              name: "Add Language",
              link: "/language"
            },
            {
              path: "edit-language/:id",
              component: AddEditLanguage,
              name: "Edit Language",
              link: "/language"
            },

            {
              path: "label",
              component: Label,
              name: "Label"
            },
            {
              path: "add-label",
              component: AddEditLabel,
              name: "Add Label",
              link: "/label"
            },
            {
              path: "edit-label/:id",
              component: AddEditLabel,
              name: "Edit Label",
              link: "/label"
            },
            {
              path: "accounttype",
              component: Accounttype,
              name: "Accounttype"
            },
            {
              path: "add-accounttype",
              component: AddEditAccounttype,
              name: "Add AccountType"
            },
            {
              path: "edit-accounttype/:id",
              component: AddEditAccounttype,
              name: "Edit AccountType"
            },
            {
              path: "payment",
              component: Payment,
              name: "Payment"
            },
            {
              path: "add-payment",
              component: AddEditPayment,
              name: "Add Payment"
            },
            {
              path: "edit-payment/:id",
              component: AddEditPayment,
              name: "Edit Payment"
            },
            {
              path: "leadsource",
              component: Leadsource,
              name: "Leadsource"
            },
            {
              path: "add-leadsource",
              component: AddEditLeadsource,
              name: "Add Leadsource"
            },
            {
              path: "edit-leadsource/:id",
              component: AddEditLeadsource,
              name: "Edit Leadsource"
            },
            {
              path: "kyc",
              component: KYC,
              name: "KYC"
            },
            {
              path: "add-kyc",
              component: AddEditKYC,
              name: "Add KYC"
            },
            {
              path: "edit-kyc/:id",
              component: AddEditKYC,
              name: "Edit KYC"
            },
            {
              path: "unit",
              component: Unit,
              name: "Unit"
            },
            {
              path: "add-unit",
              component: AddEditUnit,
              name: "Add Unit"
            },
            {
              path: "edit-unit/:id",
              component: AddEditUnit,
              name: "Edit Unit"
            },
            {
              path: "country",
              component: Country,
              name: "Country"
            },
            {
              path: "add-country",
              component: AddEditCountry,
              name: "Add Country"
            },
            {
              path: "edit-country/:id",
              component: AddEditCountry,
              name: "Edit Country"
            },
            {
              path: "product",
              component: Product,
              name: "Product"
            },
            {
              path: "add-product",
              component: AddEditProduct,
              name: "Add Product"
            },
            {
              path: "edit-product/:id",
              component: AddEditProduct,
              name: "Edit Product"
            },
            {
              path: "state",
              component: State,
              name: "State"
            },
            {
              path: "add-state",
              component: AddEditState,
              name: "Add State"
            },
            {
              path: "edit-state/:id",
              component: AddEditState,
              name: "Edit State"
            },
            {
              path: "city",
              component: City,
              name: "City"
            },
            {
              path: "add-city",
              component: AddEditCity,
              name: "Add City"
            },
            {
              path: "edit-city/:id",
              component: AddEditCity,
              name: "Edit City"
            },
            {
              path: "Area",
              component: AreaMaster,
              name: "Area"
            },
            {
              path: "add-area",
              component: AddEditAreaMaster,
              name: "Add Area"
            },
            {
              path: "edit-area/:id",
              component: AddEditAreaMaster,
              name: "Edit Area"
            },
            {
              path: "Room",
              component: RoomMaster,
              name: "Room"
            },
            {
              path: "add-room",
              component: AddEditRoomMaster,
              name: "Add Room"
            },
            {
              path: "edit-room/:id",
              component: AddEditRoomMaster,
              name: "Edit Room"
            },
            {
              path: "pincode",
              component: Pincode,
              name: "Pincode"
            },
            {
              path: "add-pincode",
              component: AddEditPincode,
              name: "Add Pincode"
            },
            {
              path: "edit-pincode/:id",
              component: AddEditPincode,
              name: "Edit Pincode"
            },
            {
              path: "accounthead",
              component: Accounthead,
              name: "Account Head"
            },
            {
              path: "add-accounthead",
              component: AddEditAccounthead,
              name: "Add Account Head"
            },
            {
              path: "edit-accounthead/:id",
              component: AddEditAccounthead,
              name: "Edit Account Head"
            },
            {
              path: "ledger",
              component: Ledger,
              name: "Ledger"
            },
            {
              path: "add-ledger",
              component: AddEditLedger,
              name: "Add Ledger"
            },
            {
              path: "edit-ledger/:id",
              component: AddEditLedger,
              name: "Edit Ledger"
            },
            {
              path: "templatecategory",
              component: TemplateCategory,
              name: "Template Category"
            },
            {
              path: "add-templatecategory",
              component: AddEditTemplateCategory,
              name: "Add Template Category"
            },
            {
              path: "edit-templatecategory/:id",
              component: AddEditTemplateCategory,
              name: "Edit Template Category"
            },
            {
              path: "templatemaster",
              component: TemplateMaster,
              name: "Template Category"
            },
            {
              path: "add-templatemaster",
              component: AddEditTemplateMaster,
              name: "Add Template Master"
            },
            {
              path: "edit-templatemaster/:id",
              component: AddEditTemplateMaster,
              name: "Edit Template Master"
            }
          ]
        }
      ]
    },
    {
      path: "pages/",
      component: Layout,
      indexRoute: { component: Page404 },
      childRoutes: [
        {
          path: "login",
          component: Login
        },
        {
          path: "404",
          component: Page404
        }
      ]
    }
  ]
};
