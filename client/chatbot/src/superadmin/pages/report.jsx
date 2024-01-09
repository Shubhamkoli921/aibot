import React, { useState } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { MdEdit } from "react-icons/md";

const Report = () => {

  const data = [
    {
      logo: 1,
      name: "John Doe",
      businessName: "Trading",
      email: "shubhamkk922@gmail.com",
      phone: 9890845263,
      city: "pune",
      pincode: 411039,
    },
    {
      logo: 2,
      name: "shubham Doe",
      businessName: "Information Technology",
      email: "shubhamkk922@gmail.com",
      phone: 9890845263,
      city: "pune",
      pincode: 411039,
    },
    {
      logo: 3,
      name: "aditya Doe",
      businessName: "Interior",
      email: "shubhamkk922@gmail.com",
      phone: 9890845263,
      city: "pune",
      pincode: 411039,
    },
  ];

  const [reports] = useState(data);
  const [currentPage, setCurrentPage] = useState(1);
  const [reportsPerPage] = useState(2);

  // Calculate the index range for the currently displayed reports
  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = reports.slice(indexOfFirstReport, indexOfLastReport);
  const paginate = pageNumber => setCurrentPage(pageNumber);
  return (
    <div>

      <div className="container mx-auto my-8  p-4 flex flex-col justify-center ">
        <div className="flex justify-center items-center w-full">
          <h2 className="text-2xl text-center font-semibold  w-[1000px]  shadow-md -mt-10 shadow-blue-300  bg-blue-500 p-4 text-white rounded-xl">User Information Table</h2>

        </div>
        <table className="flex flex-col rounded-xl w-full h-[70vh] bg-white p-4 mt-1  ">
          <thead className="mt-5">
            <tr className="grid grid-cols-8 text-sm text-gray-600">
              <th className=" p-2 col-span-1">Logo</th>
              <th className=" p-2">Owner Name</th>
              <th className=" p-2">Business Name</th>
              <th className=" p-2 col-span-2  ">Email</th>
              <th className=" p-2">Phone</th>
              <th className=" p-2">City</th>
              <th className=" p-2">Pincode</th>
              {/* <th className="p-2">Edit/Action</th> */}
              {/* <th className="p-2">Action</th> */}
            </tr>
          </thead>
          {currentReports.map(report => (
            <tr key={report.id} className="hover:bg-gray-100 grid grid-cols-8 w-full text-xs ">
              <td className="p-2 text-center">{report.logo}</td>
              <td className="p-2 text-center">{report.name}</td>
              <td className="p-2 text-center">{report.businessName}</td>
              <td className="p-2 text-center col-span-2" >{report.email}</td>
              <td className="p-2 text-center">{report.city}</td>
              <td className="p-2 text-center">{report.phone}</td>
              <td className="p-2 text-center">{report.pincode}</td>
              {/* Add more cells for additional report data */}
            </tr>
          ))}
          
        </table>
        <div className="flex w-full justify-between p-4 m-2 h-full items-center ">
            <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
              <FaAngleLeft />
            </button>
            <span>{`Page ${currentPage}`}</span>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={indexOfLastReport >= reports.length}
            >
              <FaAngleRight />
            </button>
          </div>

      </div>
    </div>
  );
};

export default Report;
