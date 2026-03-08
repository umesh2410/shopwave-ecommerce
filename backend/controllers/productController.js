const db = require('../config/db');
const slugify = require('slugify');
const csv = require('csv-parser');
const stream = require('stream');

exports.getProducts = async (req, res, next) => {
  try {
    const { category, search, page = 1, limit = 12, sort = 'created_at', order = 'DESC' } = req.query;
    const offset = (page - 1) * limit;
    const conditions = ['p.is_active = true'];
    const params = [];

    if (category) { params.push(category); conditions.push(`c.slug = $${params.length}`); }
    if (search) { params.push(`%${search}%`); conditions.push(`(p.name ILIKE $${params.length} OR p.description ILIKE $${params.length})`); }

    const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
    const validSort = ['price', 'rating', 'created_at', 'name'].includes(sort) ? sort : 'created_at';
    const validOrder = ['ASC', 'DESC'].includes(order.toUpperCase()) ? order.toUpperCase() : 'DESC';

    const countRes = await db.query(`SELECT COUNT(*) FROM products p LEFT JOIN categories c ON p.category_id = c.id ${where}`, params);
    params.push(limit, offset);
    const result = await db.query(
      `SELECT p.*, c.name as category_name, c.slug as category_slug FROM products p LEFT JOIN categories c ON p.category_id = c.id ${where} ORDER BY p.${validSort} ${validOrder} LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );
    res.json({ products: result.rows, total: parseInt(countRes.rows[0].count), page: parseInt(page), limit: parseInt(limit) });
  } catch (err) { next(err); }
};

exports.getProduct = async (req, res, next) => {
  try {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(req.params.id);
    const query = isUuid 
      ? `SELECT p.*, c.name as category_name, c.slug as category_slug FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = $1`
      : `SELECT p.*, c.name as category_name, c.slug as category_slug FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.slug = $1`;
      
    const result = await db.query(query, [req.params.id]);
    if (!result.rows[0]) return res.status(404).json({ error: 'Product not found' });
    res.json(result.rows[0]);
  } catch (err) { next(err); }
};

exports.createProduct = async (req, res, next) => {
  try {
    const { name, description, price, compare_price, stock, category_id, image_url, images, is_featured } = req.body;
    if (!name || !price) return res.status(400).json({ error: 'Name and price are required' });
    
    const slug = slugify(name, { lower: true, strict: true }) + '-' + Date.now();
    
    // Handle empty strings for numeric types
    const parsedPrice = parseFloat(price);
    const parsedComparePrice = (compare_price === "" || compare_price === null) ? null : parseFloat(compare_price);
    const parsedStock = (stock === "" || stock === null) ? 0 : parseInt(stock);

    const result = await db.query(
      `INSERT INTO products (name, slug, description, price, compare_price, stock, category_id, image_url, images, is_featured) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [name, slug, description, parsedPrice, parsedComparePrice, parsedStock, category_id || null, image_url, JSON.stringify(images || []), is_featured || false]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { next(err); }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const { name, description, price, compare_price, stock, category_id, image_url, images, is_featured, is_active } = req.body;
    
    // Handle empty strings for numeric types
    const parsedPrice = parseFloat(price);
    const parsedComparePrice = (compare_price === "" || compare_price === null) ? null : parseFloat(compare_price);
    const parsedStock = (stock === "" || stock === null) ? 0 : parseInt(stock);

    const result = await db.query(
      `UPDATE products SET name=$1, description=$2, price=$3, compare_price=$4, stock=$5, category_id=$6, image_url=$7, images=$8, is_featured=$9, is_active=$10, updated_at=NOW() WHERE id=$11 RETURNING *`,
      [name, description, parsedPrice, parsedComparePrice, parsedStock, category_id || null, image_url, JSON.stringify(images || []), is_featured, is_active, req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Product not found' });
    res.json(result.rows[0]);
  } catch (err) { next(err); }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    await db.query('UPDATE products SET is_active = false WHERE id = $1', [req.params.id]);
    res.json({ message: 'Product deleted successfully' });
  } catch (err) { next(err); }
};

exports.bulkUpload = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No CSV file uploaded' });
    const results = [];
    const bufferStream = new stream.PassThrough();
    bufferStream.end(req.file.buffer);

    bufferStream
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        let successCount = 0;
        let errorCount = 0;
        for (const row of results) {
          try {
            const { name, description, price, compare_price, stock, category_id, image_url } = row;
            if (!name || !price) { errorCount++; continue; }
            const slug = slugify(name, { lower: true, strict: true }) + '-' + Date.now() + Math.floor(Math.random() * 1000);
            await db.query(
              `INSERT INTO products (name, slug, description, price, compare_price, stock, category_id, image_url) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
              [name, slug, description, price, compare_price || null, stock || 0, category_id || null, image_url || null]
            );
            successCount++;
          } catch (e) {
            errorCount++;
          }
        }
        res.json({ message: 'Bulk upload completed', success: successCount, failed: errorCount });
      });
  } catch (err) { next(err); }
};
