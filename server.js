/*********************************************************************************
 *  WEB322 – Assignment 03
 *  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part
 *  of this assignment has been copied manually or electronically from any other source
 *  (including 3rd party web sites) or distributed to other students.
 *
 *  Name: ______________________ Student ID: ______________ Date: ________________
 *
 *  Online (Cyclic) Link:
 *
 ********************************************************************************/

const HTTP_PORT = process.env.PORT || 9080;

const fs = require('fs');
const multer = require('multer');
const express = require('express');
const path = require('path');
const app = express();

const data = require(path.join(__dirname, 'blog-service.js'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const storage = multer.diskStorage({
  destination: './public/images/uploaded',
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

app.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, '/views/home.html'));
});

app.get('/about', (req, res, next) => {
  res.sendFile(path.join(__dirname, '/views/about.html'));
});

app.get('/students', (req, res, next) => {
  if (req.query.status) {
    data
      .getStudentsByStatus(req.query.status)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.json({ message: err });
      });
  } else if (req.query.program) {
    data
      .getStudentsByProgramCode(req.query.program)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.json({ message: err });
      });
  } else if (req.query.credential) {
    data
      .getStudentsByExpectedCredential(req.query.credential)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.json({ message: err });
      });
  } else {
    data
      .getAllStudents()
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        console.log('Error retrieving employees: ' + err);
        res.json({ message: err });
      });
  }
});

app.get('/student/:id', (req, res, next) => {
  data
    .getStudentById(req.params.id)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json({ message: err });
    });
});

app.post('/students/add', (req, res, next) => {
  data
    .addStudent(req.body)
    .then((data) => {
      res.redirect('/students');
    })
    .catch((err) => {
      console.log('Error adding employee: ' + err);
      res.json({ message: err });
    });
});

app.post('/images/add', upload.single('imageFile'), (req, res) => {
  res.redirect('/images');
});

app.get('/images', (req, res, next) => {
  fs.readdir('./public/images/uploaded', (err, items) => {
    res.json(items);
  });
});

app.get('/students/add', (req, res, next) => {
  res.sendFile(path.join(__dirname, '/views/addStudent.html'));
});
app.get('/images/add', (req, res, next) => {
  res.sendFile(path.join(__dirname, '/views/addImage.html'));
});

app.get('/intlstudents', (req, res, next) => {
  data
    .getInternationalStudents()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log('Error retrieving managers: ' + err);
      res.json({ message: err });
    });
});

app.get('/programs', (req, res, next) => {
  data
    .getPrograms()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log('Error retrieving departments: ' + err);
      res.json({ message: err });
    });
});

app.use((req, res, next) => {
  res.status(404).send('Page Not Found');
});

data
  .initialize()
  .then(() => {
    app.listen(HTTP_PORT);
    console.log('Express http server listening on ' + HTTP_PORT);
  })
  .catch((err) => {
    console.log('Error starting server: ' + err + ' aborting startup');
  });
