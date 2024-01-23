import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import Modal from "react-modal";
import { IoClose } from "react-icons/io5";
import ReactPaginate from "react-paginate";

const ProductTable = () => {

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [pageNumber, setPageNumber] = useState(0);
  const productsPerPage = 5;

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }


  const initialProducts = [
    { id: 1, productName: "Product A", price: 20.99, description: "Description for Product A" },
    { id: 2, productName: "Product B", price: 15.49, description: "Description for Product B" },
    { id: 3, productName: "Product C", price: 30.00, description: "Description for Product C" },
  ];

  const [products, setProducts] = useState(initialProducts);
  const [editedProduct, setEditedProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({ productName: "", price: 0, description: "" });

  const pagesVisited = pageNumber * productsPerPage;

  const displayProducts = products
    .slice(pagesVisited, pagesVisited + productsPerPage)
    .map((product) => (
      <tr key={product.id}>
        <td className="border px-4 py-2">{product.id}</td>
        <td className="border px-4 py-2">
          {editedProduct && editedProduct.id === product.id ? (
            <input
              type="text"
              value={editedProduct.productName}
              onChange={(e) =>
                setEditedProduct((prevProduct) => ({
                  ...prevProduct,
                  productName: e.target.value,
                }))
              }
              className="w-full border rounded py-1 px-2"
            />
          ) : (
            product.productName
          )}
        </td>
        <td className="border px-4 py-2">
          {editedProduct && editedProduct.id === product.id ? (
            <input
              type="number"
              value={editedProduct.price}
              onChange={(e) =>
                setEditedProduct((prevProduct) => ({
                  ...prevProduct,
                  price: e.target.value,
                }))
              }
              className="w-full border rounded py-1 px-2"
            />
          ) : (
            `$${parseFloat(product.price).toFixed(2)}`
          )}
        </td>
        <td className="border px-4 py-2">
          {editedProduct && editedProduct.id === product.id ? (
            <input
              type="text"
              value={editedProduct.description}
              onChange={(e) =>
                setEditedProduct((prevProduct) => ({
                  ...prevProduct,
                  description: e.target.value,
                }))
              }
              className="w-full border rounded py-1 px-2"
            />
          ) : (
            product.description
          )}
        </td>
        <td className="border px-4 py-2">
          {editedProduct && editedProduct.id === product.id ? (
            <button
              onClick={() => handleUpdate(product.id, editedProduct)}
              className="bg-blue-500 text-white px-2 py-1 rounded"
            >
              Save
            </button>
          ) : (
            <>
              <button
                onClick={() => handleEdit(product.id)}
                className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </>
          )}
        </td>
      </tr>
    ));

  const pageCount = Math.ceil(products.length / productsPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };


  useEffect(() => {
    // Fetch products from Flask API on component mount
    axios.get("http://localhost:5000/products")
      .then(response => setProducts(response.data))
      .catch(error => console.error("Error fetching products:", error));
  }, []);

  const handleEdit = (productId) => {
    const productToEdit = products.find((product) => product.id === productId);
    setEditedProduct({ ...productToEdit });
  };

  const handleUpdate = (productId, updatedFields) => {
    axios.put(`http://localhost:5000/products/${productId}`, updatedFields)
      .then(response => {
        console.log(response.data.message);
        // Fetch updated products after successful update
        axios.get("http://localhost:5000/products")
          .then(response => setProducts(response.data))
          .catch(error => console.error("Error fetching products:", error));
      })
      .catch(error => console.error("Error updating product:", error));

    setEditedProduct(null);
  };

  const handleDelete = (productId) => {
    axios.delete(`http://localhost:5000/products/${productId}`)
      .then(response => {
        console.log(response.data.message);
        // Fetch updated products after successful deletion
        axios.get("http://localhost:5000/products")
          .then(response => setProducts(response.data))
          .catch(error => console.error("Error fetching products:", error));
      })
      .catch(error => console.error("Error deleting product:", error));

    setEditedProduct(null);
  };

  const handleAddProduct = () => {
    axios.post("http://localhost:5000/products", newProduct)
      .then(response => {
        console.log("Product added with ID:", response.data.id);
        // Fetch updated products after successful addition
        axios.get("http://localhost:5000/products")
          .then(response => setProducts(response.data))
          .catch(error => console.error("Error fetching products:", error));
      })
      .catch(error => console.error("Error adding product:", error));

    setNewProduct({ productName: "", price: 0, description: "" });
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const parsedProducts = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        const newProducts = parsedProducts.map((row, index) => ({
          id: products.length + index + 1,
          productName: row[0],
          price: parseFloat(row[1]),
          description: row[2],
        }));

        axios.post("http://localhost:5000/products/bulk", newProducts)
          .then(response => {
            console.log("Products added successfully");
            // Fetch updated products after successful bulk addition
            axios.get("http://localhost:5000/products")
              .then(response => setProducts(response.data))
              .catch(error => console.error("Error fetching products:", error));
          })
          .catch(error => console.error("Error adding products:", error));
      };

      reader.readAsBinaryString(file);
    }
  };

  return (
    <div className="container flex mx-auto mt-8">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl mb-4">Product Table</h2>
        <div className="mt-8 flex w-full justify-between">
          <div className="cursor-pointer text-xl" onClick={openModal}>
            Openmodal
          </div>
          <div>
            <h2 className="text-xl mb-4">Upload Products</h2>
            <input type="file" accept=".csv, .xlsx" onChange={handleFileUpload} className="mb-4" />
          </div>
        </div>
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className="border">ID</th>
              <th className="border">Product Name</th>
              <th className="border">Price</th>
              <th className="border">Description</th>
              <th className="border">Actions</th>
            </tr>
          </thead>
          <tbody>{displayProducts}</tbody>
        </table>
        <div className="mt-4">
          <ReactPaginate className="flex justify-between w-full"
            previousLabel={"Previous"}
            nextLabel={"Next"}
            pageCount={pageCount}
            onPageChange={changePage}
            containerClassName={"pagination"}
            previousLinkClassName={"pagination__link"}
            nextLinkClassName={"pagination__link"}
            disabledClassName={"pagination__link--disabled"}
            activeClassName={"pagination__link--active"}
          />
        </div>

        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="Update User Modal"
        >
          <button type="button" onClick={closeModal}>
            <IoClose size={20} />
          </button>

          <div className="mt-8">
            <h2 className="text-3xl mb-4">Add New Product</h2>
            <form>
              <label className="block mb-2">
                Product Name:
                <input
                  type="text"
                  value={newProduct.productName}
                  onChange={(e) =>
                    setNewProduct((prevProduct) => ({ ...prevProduct, productName: e.target.value }))
                  }
                  className="w-full border rounded py-1 px-2"
                />
              </label>
              <label className="block mb-2">
                Price:
                <input
                  type="number"
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct((prevProduct) => ({ ...prevProduct, price: parseFloat(e.target.value) }))
                  }
                  className="w-full border rounded py-1 px-2"
                />
              </label>
              <label className="block mb-2">
                Description:
                <input
                  type="text"
                  value={newProduct.description}
                  onChange={(e) =>
                    setNewProduct((prevProduct) => ({ ...prevProduct, description: e.target.value }))
                  }
                  className="w-full border rounded py-1 px-2"
                />
              </label>
              <button
                type="button"
                onClick={handleAddProduct}
                className="bg-green-500 text-white px-2 py-1 rounded"
              >
                Add Product
              </button>
            </form>
          </div>

        </Modal>
      </div>




    </div>
  );
};

export default ProductTable;
