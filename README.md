\# Job Management Dashboard



A web-based Job Management Dashboard built using Django and Django REST Framework. This application helps users create, manage, update, track, and organize job postings through a simple dashboard interface.



\## 🚀 Features



\- \*\*Dashboard Overview:\*\* View total jobs and job counts by status.

\- \*\*Create Jobs:\*\* Add new job postings with relevant details.

\- \*\*View Jobs:\*\* Display and manage all available job records.

\- \*\*Update Jobs:\*\* Edit existing job information.

\- \*\*Delete Jobs:\*\* Remove job postings.

\- \*\*Duplicate Jobs:\*\* Create copies of existing job postings.

\- \*\*Job Status Management:\*\* Manage job statuses:

&#x20; - Draft

&#x20; - Requested

&#x20; - Posted

&#x20; - Filled

\- \*\*Search and Filtering:\*\* Filter jobs by status and city and search job listings.

\- \*\*Job Categories:\*\* Organize jobs into Full-Time, Part-Time, and Internship categories.

\- \*\*Profile Pictures:\*\* Upload images for job profiles.

\- \*\*Analytics:\*\* View job statistics and status distribution.



\## 🛠️ Technologies Used



\### Backend

\- Python

\- Django

\- Django REST Framework

\- MySQL



\### Frontend

\- HTML5

\- CSS3

\- JavaScript

\- Bootstrap 5

\- Bootstrap Icons



\### Tools

\- Git

\- GitHub

\- Visual Studio Code

\- Postman



\## 📁 Project Structure



```text

job-management-dashboard/

│

├── config/

│   ├── settings.py

│   ├── urls.py

│   └── ...

│

├── jobs/

│   ├── migrations/

│   ├── models.py

│   ├── serializers.py

│   ├── views.py

│   ├── urls.py

│   └── ...

│

├── job\_profiles/

│

├── static/

│   ├── css/

│   ├── js/

│   └── images/

│

├── templates/

│   └── jobs/

│       ├── dashboard.html

│       └── job\_form.html

│

├── manage.py

├── .gitignore

└── README.md

```



\## ⚙️ Installation and Setup



\### 1. Clone the Repository



```bash

git clone https://github.com/MukeshKumar-2005/job-management-dashboard.git

```



\### 2. Navigate to the Project Directory



```bash

cd job-management-dashboard

```



\### 3. Create a Virtual Environment



```bash

python -m venv venv

```



\### 4. Activate the Virtual Environment



For Windows:



```bash

venv\\Scripts\\activate

```



\### 5. Install Dependencies



```bash

pip install django djangorestframework mysqlclient pillow

```



Install any additional packages required by the project.



\### 6. Configure the Database



Create a MySQL database and configure its connection details in your Django settings using environment variables.



\### 7. Apply Migrations



```bash

python manage.py makemigrations

python manage.py migrate

```



&#x20;8. Run the Development Server



```bash

python manage.py runserver

```



Open your browser:



http://127.0.0.1:8000/



&#x20;API Endpoints



Base URL:



```text

http://127.0.0.1:8000/api/

```



| Method | Endpoint | Description |

|---|---|---|

| GET | `/api/jobs/` | Retrieve all jobs |

| POST | `/api/jobs/` | Create a new job |

| GET | `/api/jobs/{id}/` | Retrieve a specific job |

| PATCH | `/api/jobs/{id}/` | Update a job |

| DELETE | `/api/jobs/{id}/` | Delete a job |

| POST | `/api/jobs/{id}/duplicate/` | Duplicate a job |

| POST | `/api/jobs/{id}/publish/` | Publish a job |

| POST | `/api/jobs/{id}/fill/` | Mark a job as filled |



&#x20;Job Status Workflow



```text

Draft → Requested → Posted → Filled

```



&#x20;Author

Mukesh Kumar



\- GitHub: \[MukeshKumar-2005](https://github.com/MukeshKumar-2005)

\- LinkedIn: \[Mukesh Bhardwaj](https://linkedin.com/in/mukeshbhardwaj-2b7556269)



\## 📌 Future Improvements



\- User authentication and role-based access.

\- Advanced job filtering and pagination.

\- Improved analytics and visual charts.

\- Deployment to a cloud hosting platform.



