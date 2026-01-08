<!-- ========================= -->
<!--        MEDSTORE README     -->
<!-- ========================= -->

<div align="center">

  <h1>🏥 MedStore</h1>
  <h3>A Modern Medicine Store Web Application</h3>

  <p>
    Built using <b>Spring Boot</b>, <b>React</b>, <b>MySQL</b>, and <b>Tailwind CSS</b>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Java-Spring%20Boot-green" />
    <img src="https://img.shields.io/badge/Frontend-React-blue" />
    <img src="https://img.shields.io/badge/Database-MySQL-orange" />
    <img src="https://img.shields.io/badge/Style-TailwindCSS-teal" />
    <img src="https://img.shields.io/badge/Status-Active-success" />
  </p>

</div>

<hr/>

<h2>📌 About The Project</h2>

<p>
<b>MedStore</b> is a full-stack medicine store web application where customers can
browse medicines while admins can securely manage products using CRUD operations.
The project focuses on clean UI, scalable backend architecture, and real-world use cases.
</p>

<hr/>

<h2>✨ Features</h2>

<h3>👨‍⚕️ Customer Features</h3>
<ul>
  <li>🔍 Search medicines with pagination</li>
  <li>🧾 View medicine details with images</li>
  <li>📱 Fully responsive design</li>
  <li>☎️ Call & WhatsApp redirection</li>
</ul>

<h3>🛠️ Admin Features</h3>
<ul>
  <li>➕ Add new medicines</li>
  <li>✏️ Update medicine details</li>
  <li>❌ Delete medicines</li>
  <li>📦 Handle large product descriptions</li>
</ul>

<hr/>

<h2>🧩 Tech Stack</h2>

<h3>Frontend</h3>
<ul>
  <li>React (Vite)</li>
  <li>Tailwind CSS</li>
  <li>Fetch API</li>
  <li>React Hot Toast</li>
</ul>

<h3>Backend</h3>
<ul>
  <li>Java</li>
  <li>Spring Boot</li>
  <li>Spring Data JPA</li>
  <li>Multipart File Upload</li>
  <li>RESTful APIs</li>
</ul>

<h3>Database</h3>
<ul>
  <li>MySQL</li>
</ul>

<hr/>

<h2>📂 Project Structure</h2>

<pre>
medstore/
│
├── backend/
│   ├── controller/
│   ├── service/
│   ├── repository/
│   ├── entity/
│   └── exception/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── assets/
│   └── App.jsx
│
└── README.md
</pre>

<hr/>

<h2>🔗 API Endpoints</h2>

<table border="1" cellpadding="8" cellspacing="0">
  <tr>
    <th>Method</th>
    <th>Endpoint</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>GET</td>
    <td>/product/get-all</td>
    <td>Fetch paginated products</td>
  </tr>
  <tr>
    <td>POST</td>
    <td>/product/add-product</td>
    <td>Add new product</td>
  </tr>
  <tr>
    <td>PUT</td>
    <td>/product/update/{id}</td>
    <td>Update product</td>
  </tr>
  <tr>
    <td>DELETE</td>
    <td>/product/delete/{id}</td>
    <td>Delete product</td>
  </tr>
</table>

<hr/>

<h2>🖼️ Image Upload Flow</h2>
<ol>
  <li>Frontend sends data using <b>FormData</b></li>
  <li>Spring Boot handles multipart requests</li>
  <li>Image stored safely</li>
  <li>Rendered dynamically in UI</li>
</ol>

<hr/>

<h2>📄 Error Handling</h2>

<p>Clean JSON-based error responses:</p>

<pre>
{
  "message": "Product not found",
  "status": 404
}
</pre>

<hr/>

<h2>▶️ Run Locally</h2>

<h3>Backend</h3>
<pre>
cd backend
mvn spring-boot:run
</pre>

<h3>Frontend</h3>
<pre>
cd frontend
npm install
npm run dev
</pre>

<hr/>

<h2>🚀 Future Enhancements</h2>
<ul>
  <li>JWT-based admin authentication</li>
  <li>Cart & Order management</li>
  <li>Ratings & Reviews</li>
  <li>Docker & Cloud deployment</li>
  <li>Admin analytics dashboard</li>
</ul>

<hr/>

<h2>🤝 Contributing</h2>
<p>
Contributions are welcome! Fork the repository and submit a pull request.
</p>

<hr/>

<h2>📜 License</h2>
<p>
This project is licensed under the <b>MIT License</b>.
</p>

<hr/>

<h2>👨‍💻 Author</h2>
<p>
<b>Ayush Kushwaha</b><br/>
Full-Stack Developer<br/>
Java | Spring Boot | React | MySQL
</p>
