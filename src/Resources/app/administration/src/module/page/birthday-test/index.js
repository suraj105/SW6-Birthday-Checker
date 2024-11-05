import './birthday-test.scss';
import template from './birthday-test.html.twig';

const { Mixin } = Shopware;

export default {
    template,

    inject: [
        'repositoryFactory',
        'acl',
    ],

    data() {
        return {
            customers: [],          // Store currently displayed customers (filtered view)
            allCustomers: [],       // Store all loaded customers
            pageSize: 500,          // Set a high page size to minimize requests
            currentPage: 1,         // Track the current page for pagination
        };
    },

    created() {
        this.loadAllCustomers(); // Load all customers on creation
    },

    methods: {
        async loadAllCustomers(page = 1) {
            const customerRepository = this.repositoryFactory.create('customer');
            let allCustomersLoaded = false;

            while (!allCustomersLoaded) {
                const criteria = new Shopware.Data.Criteria().setPage(page).setLimit(this.pageSize);
                criteria.addFilter(Shopware.Data.Criteria.equals('active', 1)); // Only active customers

                await customerRepository.search(criteria, Shopware.Context.api).then((result) => {
                    if (result.length > 0) {
                        this.allCustomers.push(...result); // Accumulate all customers
                        page++; // Move to the next page
                    } else {
                        allCustomersLoaded = true; // Stop if no more results are found
                    }
                });
            }

            // Set the customers data to show all loaded customers initially
            this.customers = [...this.allCustomers];
        },

        showAllCustomers() {
            // Reset customers to show all loaded customers
            this.customers = [...this.allCustomers];
        },

        showTodaysBirthdaysOnly() {
            const today = new Date();
            const todayMonth = today.getMonth() + 1;
            const todayDate = today.getDate();

            // Filter customers by today's birthday from loaded customers (client-side)
            const birthdayCustomers = this.allCustomers.filter(customer => {
                if (customer.birthday) {
                    const birthday = new Date(customer.birthday);
                    return (
                        birthday.getMonth() + 1 === todayMonth &&
                        birthday.getDate() === todayDate
                    );
                }
                return false;
            });

            this.customers = birthdayCustomers;

            // Show alert with each name on a new line if there are any birthdays today
            if (birthdayCustomers.length > 0) {
                const birthdayNames = birthdayCustomers.map(customer => customer.firstName + ' ' + customer.lastName).join('\n');
                alert(`Happy Birthday to:\n${birthdayNames}`);
            } else {
                alert("No customers have birthdays today.");
            }
        },

        
        sendEmailToCustomer(email) {
            if (email) {
                window.location.href = `mailto:${email}`;
            } else {
                alert("No email address available for this customer.");
            }


        // Other existing methods...
    },



        formatDate(date) {
            return date ? date.split('T')[0] : '';
        }
    },
};
