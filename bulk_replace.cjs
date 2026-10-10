const fs = require('fs');
const path = require('path');

const replacements = [
    // Theme names
    ['RentHub', 'LibraryHub'],
    ['Equipment & Vehicle Rental System', 'Library & Book Management System'],
    
    // Identity
    ['Wira Yudha Pamuji', 'Satria Wijayanto'],
    ['2410010396', '9876543210'], // placeholder NPM
    ['wirayudhapamuji123', 'satriawijayantomalang-design'],
    
    // Models & Classes
    ['RentalItem', 'Book'],
    ['RentalDetail', 'LoanDetail'],
    ['RentalReturn', 'LoanReturn'],
    ['ItemSpecification', 'BookDetail'],
    ['Rental', 'Loan'],
    
    // variables / relations
    ['rentalItems', 'books'],
    ['rentalItem', 'book'],
    ['rentalDetails', 'loanDetails'],
    ['rentalDetail', 'loanDetail'],
    ['rentalReturns', 'loanReturns'],
    ['rentalReturn', 'loanReturn'],
    ['itemSpecifications', 'bookDetails'],
    ['itemSpecification', 'bookDetail'],
    ['rentals', 'loans'],
    ['rental', 'loan'],
    ['items', 'books'], // e.g. rental->items()
    ['returnRecord', 'returnRecord'], // no change
    
    // database columns / tables
    ['rental_items', 'books'],
    ['rental_item_id', 'book_id'],
    ['rental_details', 'loan_details'],
    ['rental_detail_id', 'loan_detail_id'],
    ['rental_returns', 'loan_returns'],
    ['rental_return_id', 'loan_return_id'],
    ['item_specifications', 'book_details'],
    ['item_specification_id', 'book_detail_id'],
    ['rentals', 'loans'],
    ['rental_id', 'loan_id'],
    
    // specific string
    ['daily_rate', 'borrow_fee'],
    ['price_per_day', 'fee_per_day'],
    ['condition_before', 'condition_out'],
    ['return_condition', 'condition_in'],
    ['total_price', 'total_fee'],
    ['Sangat Baik', 'Good'],
];

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        if (file === 'node_modules' || file === '.git' || file === 'vendor' || file === 'storage' || file === 'bootstrap' || file === 'public') return;
        
        const fullPath = path.resolve(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(fullPath));
        } else {
            // only process specific extensions
            if (/\.(php|md|json)$/i.test(fullPath)) {
                results.push(fullPath);
            }
        }
    });
    return results;
}

const files = walk(process.cwd());

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    
    replacements.forEach(([search, replace]) => {
        const regex = new RegExp(search, 'g');
        content = content.replace(regex, replace);
    });
    
    if (original !== content) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated: ${file}`);
    }
});

// Rename files
function renameFiles(dir) {
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        if (file === 'node_modules' || file === '.git' || file === 'vendor') return;
        
        const fullPath = path.resolve(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat && stat.isDirectory()) {
            renameFiles(fullPath);
        }
        
        let newName = file;
        replacements.forEach(([search, replace]) => {
            if (/^[A-Za-z0-9_.-]+$/.test(search) && search.length > 3) {
                 newName = newName.replace(search, replace);
            }
        });
        
        if (newName !== file) {
            const newPath = path.resolve(dir, newName);
            fs.renameSync(fullPath, newPath);
            console.log(`Renamed: ${file} -> ${newName}`);
        }
    });
}

renameFiles(process.cwd());
