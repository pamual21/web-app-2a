const fs = require('fs');
const path = require('path');

var students = [];
var programs = [];

const initialize = () => {
  return new Promise((resolve, reject) => {
    try {
      fs.readFile(
        path.join(__dirname, '/data/students.json'),
        'utf-8',
        (err, data) => {
          if (err) {
            console.log(err);
            throw err;
          }

          students = JSON.parse(data);
        }
      );

      fs.readFile(
        path.join(__dirname, '/data/programs.json'),
        'utf-8',
        (err, data) => {
          if (err) {
            console.log(err);
            throw err;
          }

          programs = JSON.parse(data);
        }
      );
    } catch (ex) {
      console.log('Error encountered in file reading.');
      reject('Error encountered in file reading.');
    }
    resolve();
  });
};

const getAllStudents = () => {
  return new Promise((resolve, reject) => {
    if (students.length === 0) {
      reject('No students found!');
    } else {
      resolve(
        students.filter(() => {
          return true;
        })
      );
    }
  });
};

const getInternationalStudents = () => {
  return new Promise((resolve, reject) => {
    const all_students = students.filter((student) => {
      return student.isInternationalStudent === true;
    });
    if (all_students.length > 0) {
      resolve(all_students);
    } else {
      reject('No results found!');
    }
  });
};

const getPrograms = () => {
  return new Promise((resolve, reject) => {
    if (programs.length === 0) {
      reject('No results found');
    } else {
      resolve(
        programs.filter(() => {
          return true;
        })
      );
    }
  });
};

const addStudent = (studentData) => {
  return new Promise((resolve, reject) => {
    studentData.isInternationalStudent =
      studentData.isInternationalStudent === 'true';
    studentData.studentID = (students.length + 1).toString();
    students.push(studentData);
    fs.writeFile(
      path.join(__dirname, '/data/students.json'),
      JSON.stringify(students),
      (err) => {
        if (err) {
          console.log(err);
          reject('Error writing file!');
        }
      }
    );
    resolve();
  });
};

const getStudentsByStatus = (status) => {
  return new Promise((resolve, reject) => {
    const all_students = students.filter((student) => {
      return student.status === status;
    });
    if (all_students.length > 0) {
      resolve(all_students);
    } else {
      reject('No results found!');
    }
  });
};

const getStudentsByProgramCode = (programCode) => {
  return new Promise((resolve, reject) => {
    const all_students = students.filter((student) => {
      return student.program === programCode;
    });
    if (all_students.length > 0) {
      resolve(all_students);
    } else {
      reject('No results found!');
    }
  });
};

const getStudentsByExpectedCredential = (credential) => {
  return new Promise((resolve, reject) => {
    const all_students = students.filter((student) => {
      return student.expectedCredential === credential;
    });
    if (all_students.length > 0) {
      resolve(all_students);
    } else {
      reject('No results found!');
    }
  });
};

const getStudentById = (sid) => {
  return new Promise((resolve, reject) => {
    const student = students.find((student) => {
      return student.studentID === sid;
    });
    if (student) {
      resolve(student);
    } else {
      reject('No results found!');
    }
  });
};
module.exports = {
  initialize,
  getAllStudents,
  getInternationalStudents,
  getPrograms,
  addStudent,
  getStudentsByStatus,
  getStudentsByProgramCode,
  getStudentsByExpectedCredential,
  getStudentById,
};
