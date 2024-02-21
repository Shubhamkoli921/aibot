import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import Modal from "react-modal";
import { IoClose } from "react-icons/io5";
import ReactPaginate from "react-paginate";
import { MdEdit } from "react-icons/md";
import { FcDocument, FcFullTrash } from "react-icons/fc";
import { HiViewGridAdd } from "react-icons/hi";

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


  // const initialProducts = [
  //   { id: 1, productName: "Product A", price: 20.99, description: "Description for Product A" },
  //   { id: 2, productName: "Product B", price: 15.49, description: "Description for Product B" },
  //   { id: 3, productName: "Product C", price: 30.00, description: "Description for Product C" },
  // ];

  const [products, setProducts] = useState([]);
  const [editedProduct, setEditedProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({ productName: "", price: 0, description: "" });

  const pagesVisited = pageNumber * productsPerPage;

  const displayProducts = products
    .slice(pagesVisited, pagesVisited + productsPerPage)
    .map((product) => (
      <tr className="hover:bg-gray-100 grid grid-cols-9  w-full text-xs " key={product.productName}>
        <td className="p-2 text-center ">{product.id}</td>
        <td className="p-2 text-center col-span-2">
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
        <td className="p-2 text-center col-span-2">
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
        <td className="p-2 text-center col-span-2">
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
        <td className="p-2 text-center col-span-2 ">
          {editedProduct && editedProduct.id === product.id ? (
            <button
              onClick={() => handleUpdate(product.id, editedProduct)}
              className="bg-blue-500 text-white px-2 py-1 rounded"
            >
              <FcDocument size={20} />
            </button>
          ) : (
            <>
              <button
                onClick={() => handleEdit(product.id)}
                className=" px-2 py-1 rounded mr-2"
              >
                <MdEdit size={20} />
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                className=" px-2 py-1 rounded"
              >
                <FcFullTrash size={20} />
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
    axios.get("https://chatbotserver1.onrender.com/products")
      .then(response => setProducts(response.data))
      .catch(error => console.error("Error fetching products:", error));
  }, []);

  const handleEdit = (productId) => {
    const productToEdit = products.find((product) => product.id === productId);
    setEditedProduct({ ...productToEdit });
  };

  const handleUpdate = (productId, updatedFields) => {
    axios.put(`https://chatbotserver1.onrender.com/${productId}`, updatedFields)
      .then(response => {
        console.log(response.data.message);
        // Fetch updated products after successful update
        axios.get("https://chatbotserver1.onrender.com/products")
          .then(response => setProducts(response.data))
          .catch(error => console.error("Error fetching products:", error));
      })
      .catch(error => console.error("Error updating product:", error));

    setEditedProduct(null);
  };

  const handleDelete = (productId) => {
    axios.delete(`https://chatbotserver1.onrender.com/products/${productId}`)
      .then(response => {
        console.log(response.data.message);
        // Fetch updated products after successful deletion
        axios.get("https://chatbotserver1.onrender.com/products")
          .then(response => setProducts(response.data))
          .catch(error => console.error("Error fetching products:", error));
      })
      .catch(error => console.error("Error deleting product:", error));

    setEditedProduct(null);
  };

  const handleAddProduct = () => {
    axios.post("https://chatbotserver1.onrender.com/products", newProduct)
      .then(response => {
        console.log("Product added with ID:", response.data.id);
        // Fetch updated products after successful addition
        axios.get("https://chatbotserver1.onrender.com/products")
          .then(response => setProducts(response.data))
          .catch(error => console.error("Error fetching products:", error));
      })
      .catch(error => console.error("Error adding product:", error));

    setNewProduct({ productName: " ", price: " ", description: " " });
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

        axios.post("https://chatbotserver1.onrender.com/products/bulk", newProducts)
          .then(response => {
            console.log("Products added successfully");
            // Fetch updated products after successful bulk addition
            axios.get("https://chatbotserver1.onrender.com/products")
              .then(response => setProducts(response.data))
              .catch(error => console.error("Error fetching products:", error));
          })
          .catch(error => console.error("Error adding products:", error));
      };

      reader.readAsBinaryString(file);
    }
  };

  return (
    <div className="container flex mx-auto">
      <div className=" w-full scale-95 mx-auto">

        <div className="mt-4 flex w-full justify-between">
          <div className=" gap-4 flex items-center justify-between w-full" >
            <div onClick={openModal} className=" flex cursor-pointer items-center">
              <HiViewGridAdd size={40} />
              <h1>Add Product</h1>
            </div>
            <div className="flex cursor-pointer">
              {/* <h2 className=" mb-4">Upload Products via file</h2> */}
              <input type="file" accept=".csv, .xlsx" onChange={handleFileUpload} />
            </div>
          </div>

        </div>
        <h2 className="text-2xl justify-center items-center font-semibold absolute w-full  shadow-md shadow-blue-300  bg-blue-500 p-4 text-white rounded-xl">User Information Table</h2>
        <table className="flex flex-col rounded-xl w-full h-full bg-white p-4 mt-10  ">
          <thead className="mt-5">
            <tr className="grid grid-cols-9 text-sm text-gray-600">
              <th className=" p-2">ID</th>
              <th className=" p-2 col-span-2">Product Name</th>
              <th className=" p-2 col-span-2">Price</th>
              <th className=" p-2 col-span-2">Description</th>
              <th className=" p-2 col-span-2">Actions</th>
            </tr>
          </thead>
          <tbody>{displayProducts}</tbody>
        </table>
        <div className="mt-4 scale-95">
          <ReactPaginate className="flex justify-between w-full  "
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
