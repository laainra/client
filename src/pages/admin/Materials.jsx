import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  CCard,
  CButton,
  CCardBody,
  CCardHeader,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableRow,
} from "@coreui/react";
import { Modal, Form, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "../../components/General/Sidebar";

function MaterialTable() {
  const [materialData, setMaterialData] = useState([]);
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [path, setPath] = useState("");
  const [showInsert, setShowInsert] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const fetchMaterialData = async () => {
    try {
      const materialsResponse = await axios.get(
        "http://localhost:8080/material"
      );

      // console.log("Categories Response:", categoriesResponse.data); // Log category data

      setMaterialData(materialsResponse.data.data);
      // setCategory(categoriesResponse.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchCategories = async () => {
    try {
      const categoriesResponse = await axios.get(
        "http://localhost:8080/category"
      );
      console.log("Categories Response:", categoriesResponse.data);

      const categoriesData = categoriesResponse.data.data || [];
      setCategories(
        Array.isArray(categoriesData)
          ? categoriesData.map((cat) => cat.name)
          : []
      );
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  useEffect(() => {
    fetchMaterialData();
    fetchCategories();
  }, []);

  console.log("categories:", categories); // Log the value of category

  const UpdateDataMaterial = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.put(
        `http://localhost:8080/update-material/${id}`,
        {
          title,
          description,
          path,
          category,
        }
      );

      if (response.status === 200) {
        alert("Data berhasil diubah");
        closeModal();
        fetchMaterialData();
      } else {
        alert("Failed to update data");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while submitting data");
    }
  };
  console.log([title, description, path, category]);
  const InsertDataMaterial = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("path", path);
      formData.append("category", category);

      const response = await axios.post(
        "http://localhost:8080/insert-material",
        { title, description, path, category }
      );

      if (response.status === 200) {
        alert("Data berhasil ditambahkan");
        closeModal();
        fetchMaterialData();
      } else {
        alert("Failed to insert data");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while submitting data");
    }
  };

  const deleteMaterial = async (event) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/delete-material/${id}`
      );

      if (response.status === 200) {
        alert("Material deleted successfully");
        closeModalDelete();
        fetchMaterialData();
      } else {
        alert("Failed to delete Material");
      }
    } catch (error) {
      console.error("An error occurred while deleting material:", error);
      alert("An error occurred while deleting material");
    }
  };

  const showModalUpdate = (data) => {
    setId(data.id);
    setTitle(data.title);
    setDescription(data.description);
    setSelectedCategory(Array.isArray(data.category) ? data.category[0] : "");
    setPath(data.path);
    setShowInsert(false);
    setShowUpdate(true);

    // Log existing data for verification
    console.log("Existing Data:", data);
  };

  const closeModal = () => {
    setId("");
    setTitle("");
    setDescription("");
    setSelectedCategory("");
    setPath("");
    setShowInsert(false);
    setShowUpdate(false);
  };
  const showModalInsert = () => {
    setId("");
    setTitle("");
    setDescription("");
    setSelectedCategory("");
    setPath("");
    setShowInsert(true);
    setShowUpdate(false);
  };

  const showModalDelete = (data) => {
    setId(data.id);
    setTitle(data.title);
    setDescription(data.description);

    setShowDelete(true);
  };

  const closeModalDelete = () => {
    setId("");
    setTitle("");
    setDescription("");
    setShowDelete(false);
  };

  return (
    <div className="container flex">
      <div className="flex">
        <Sidebar />
        <div className=" p-5 justify-end">
          <Modal show={showDelete} onHide={closeModalDelete}>
            <Modal.Header closeButton>
              <Modal.Title>Are you sure to delete this data?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="col-sm-12">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Detail Data</h5>
                    <div className="row">
                      <p className="col-4 card-text">Material Name</p>
                      <p className="col-6 card-text">: {title}</p>
                    </div>
                    <div className="row">
                      <p className="col-4 card-text">Description</p>
                      <p className="col-6 card-text">: {description}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                type="submit"
                color="primary"
                className="px-4"
                onClick={() => deleteMaterial(id)}
              >
                Hapus Data
              </Button>
              <Button variant="danger" onClick={closeModalDelete}>
                Batal
              </Button>
            </Modal.Footer>
          </Modal>
          <Modal show={showInsert} onHide={closeModal}>
            <Modal.Header closeButton>
              <Modal.Title>Form Insert Data</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={InsertDataMaterial}>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    autoFocus
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                  />
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    type="text"
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                  />
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlSelect1">
                  <Form.Label>Category</Form.Label>
                  <Form.Control
                    as="select"
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    value={category}
                  >
                    <option value={category} disabled>
                      Select a category
                    </option>
                    {categories.map((categoryItem, index) => (
                      <option key={index} value={categoryItem}>
                        {categoryItem}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Label>Path Material</Form.Label>
                  <h6 className="text-xs">
                    if link https://www.youtube.com/watch?v=(vx6g-c2jYp0), use
                    only (vx6g-c2jYp0)
                  </h6>
                  <Form.Control
                    type="text"
                    // onChange={handleFileChange}
                    onChange={(e) => setPath(e.target.value)}
                    placeholder=""
                  />
                </Form.Group>
                <Button type="submit" color="primary" className="px-4 mt-2">
                  Insert
                </Button>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={closeModal}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
          <Modal show={showUpdate} onHide={closeModal}>
            <Modal.Header closeButton>
              <Modal.Title>Form Update Data</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={UpdateDataMaterial}>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    autoFocus
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                  />
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Label></Form.Label>
                  <Form.Control
                    type="text"
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                  />
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlSelect1">
                  <Form.Label>Category</Form.Label>
                  <Form.Control
                    as="select"
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    value={category}
                  >
                    <option value="" disabled>
                      Select a category
                    </option>
                    {categories.map((categoryItem, index) => (
                      <option key={index} value={categoryItem}>
                        {categoryItem}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Label>Path Material</Form.Label>
                  <h6 className="text-xs">
                    if link https://www.youtube.com/watch?v=(vx6g-c2jYp0), use
                    only (vx6g-c2jYp0)
                  </h6>
                  <Form.Control
                    // onChange={handleFileChange}
                    onChange={(e) => setPath(e.target.value)}
                    // accept=".jpg, .jpeg, .png"
                    type="text"
                    value={path}
                  />
                </Form.Group>
                <Button type="submit" color="primary" className="px-4 my-4">
                  Update
                </Button>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={closeModal}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
          <h1 className="py-1">Materials Data</h1>

          <CCard className="mb-4 mx-auto">
            <CCardHeader>
              <strong>Material Table</strong>
            </CCardHeader>
            <CButton
              className="btn btn-default text-white center"
              onClick={showModalInsert}
            >
              Add Material
            </CButton>
            <CCardBody>
              <p className="text-medium-emphasis small">
                This table displays material data.
              </p>
              <CTable striped>
                <CTableHead>
                  <CTableRow>
                    <CTableDataCell className="text-center">
                      <strong>No</strong>
                    </CTableDataCell>
                    <CTableDataCell className="text-center">
                      <strong>Title</strong>
                    </CTableDataCell>
                    <CTableDataCell className="text-center">
                      <strong>Description</strong>
                    </CTableDataCell>
                    <CTableDataCell className="text-center">
                      <strong>Path</strong>
                    </CTableDataCell>
                    <CTableDataCell className="text-center">
                      <strong>Category</strong>
                    </CTableDataCell>
                    <CTableDataCell className="text-center">
                      <strong>Action</strong>
                    </CTableDataCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {materialData.map((material, index) => (
                    <CTableRow key={material.id}>
                      <CTableDataCell className="text-center">
                        {index + 1}
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        {material.title}
                      </CTableDataCell>
                      <CTableDataCell
                        className="text-center"
                        style={{
                          maxWidth: "20rem",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {material.description}
                      </CTableDataCell>

                      <CTableDataCell className="text-center">
                        <iframe
                          width="144"
                          height="96"
                          src={`https://www.youtube.com/embed/${material.path}`}
                          title="YouTube video player"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </CTableDataCell>

                      <CTableDataCell className="text-center">
                        {material.category}
                      </CTableDataCell>
                      <CTableDataCell className="text-center ">
                        <Button
                          variant="primary"
                          className="mb-3"
                          onClick={() => showModalUpdate(material)}
                        >
                          Update
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => showModalDelete(material)}
                        >
                          Delete
                        </Button>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </div>
      </div>
    </div>
  );
}

export default MaterialTable;
