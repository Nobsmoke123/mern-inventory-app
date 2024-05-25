const { fileSizeFormatter } = require('../utility/file_upload');
const {
  createProductValidationSchema,
  updateProductValidationSchema,
} = require('../validators/validation_schemas');
const ProductModel = require('./../model/product.model');
const cloudinaryFileUpload = require('./../utility/cloud_file_upload');

class ProductController {
  async createProduct(req, res) {
    await createProductValidationSchema.validateAsync(req.body);

    const { name, description, price, quantity, sku, category } = req.body;

    const userId = req.user._id;

    let fileData = {};

    if (req.file) {
      const filePath = await cloudinaryFileUpload(req.file.path);

      fileData = {
        fileName: req.file.originalname,
        filePath: filePath,
        fileType: req.file.mimetype,
        fileSize: fileSizeFormatter(req.file.size, 2),
      };
    }

    const product = await ProductModel.create({
      name,
      description,
      price,
      quantity,
      sku,
      category,
      user: userId,
      image: fileData,
    });

    return res.status(201).json({
      msg: 'Product created successfully.',
      product,
    });
  }

  async getProduct(req, res) {
    const { productId } = req.params;

    const product = await ProductModel.findOne({ _id: productId });

    if (!product) {
      return res.status(404).json({
        msg: 'Product not found.',
        product: null,
      });
    }

    if (product.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        msg: 'Unauthorized lookup.',
      });
    }

    return res.status(200).json({
      msg: 'Product details',
      product,
    });
  }

  async listProducts(req, res) {
    const userId = req.user._id;

    const products = await ProductModel.find({ user: userId });

    return res.status(200).json({
      msg: 'Product listings',
      products,
    });
  }

  async updateProduct(req, res) {
    await updateProductValidationSchema.validateAsync(req.body);

    const { productId } = req.params;

    const findProduct = await ProductModel.findOne({
      _id: productId,
    });

    if (!findProduct) {
      return res.status(404).json({
        msg: 'Product not found.',
      });
    }

    if (findProduct.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        msg: 'Unauthorized lookup.',
      });
    }

    const { name, sku, category, quantity, price, description, image } =
      req.body;

    let fileData = {};

    if (req.file) {
      const filePath = await cloudinaryFileUpload(req.file.path);

      fileData = {
        fileName: req.file.originalname,
        filePath: filePath,
        fileType: req.file.mimetype,
        fileSize: fileSizeFormatter(req.file.size, 2),
      };
    }

    const product = await ProductModel.findOneAndUpdate(
      { _id: productId },
      {
        name,
        sku,
        category,
        quantity,
        price,
        description,
        image:
          Object.values(fileData).length > 0 ? fileData : findProduct.image,
      },
      {
        new: true,
      }
    );

    return res.status(200).json({
      msg: 'Product updated successfully.',
      product,
    });
  }

  async deleteProduct(req, res) {
    const { productId } = req.params;

    const findProduct = await ProductModel.findOne({
      _id: productId,
    });

    if (!findProduct) {
      return res.status(404).json({
        msg: 'Product not found.',
      });
    }

    if (findProduct.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        msg: 'Unauthorized lookup.',
      });
    }

    await findProduct.deleteOne();

    return res.status(200).json({
      msg: 'Product deleted successfully.',
      findProduct,
    });
  }
}

module.exports = new ProductController();
