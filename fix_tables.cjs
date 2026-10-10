const fs = require('fs');
const path = require('path');

function walk(d) {
    let r = [];
    fs.readdirSync(d).forEach(f => {
        if (['node_modules', '.git', 'vendor', 'storage', 'bootstrap'].includes(f)) return;
        let p = path.join(d, f);
        if (fs.statSync(p).isDirectory()) r = r.concat(walk(p));
        else if (/\.(php|md)$/i.test(p)) r.push(p);
    });
    return r;
}

walk('.').forEach(f => {
    let c = fs.readFileSync(f, 'utf8');
    let r = c.replace(/loan_books/g, 'books')
             .replace(/item_tag/g, 'book_tag')
             .replace(/item_id/g, 'book_id')
             .replace(/item_specifications/g, 'book_details')
             .replace(/ItemTag/g, 'BookTag');
    if (c !== r) {
        fs.writeFileSync(f, r);
        console.log('Fixed', f);
    }
});
