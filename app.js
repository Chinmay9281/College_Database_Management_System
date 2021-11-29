const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/collegeDB");
const studentSchema = {
  MisId: String,
  Name: String,
  email: String,
  number: Number,
  dob: String,
  doe: String,
  branch: String,
  password: String,
  total: Number,
  attendance: Number,
};

const lectureSchema = {
  subject: String,
  startTime: String,
  endTime: String,
};

const facultySchema = {
  Name: String,
  email: String,
  number: Number,
  subject: String,
  password: String,
};

const Student = mongoose.model("Student", studentSchema);
const Faculty = mongoose.model("Faculty", facultySchema);
const Lecture = mongoose.model("Lecture", lectureSchema);

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/student", function (req, res) {
  res.render("student");
});

app.get("/faculty", function (req, res) {
  res.render("faculty");
});

app.get("/studentRegister", function (req, res) {
  res.render("studentRegister");
});

app.get("/studentData", function (req, res) {
  res.render("studentData");
});

app.get("/facultyRegister", function (req, res) {
  res.render("facultyRegister");
});

app.get("/display", function (req, res) {
  res.render("display");
});

app.get("/attendance", function (req, res) {
  // console.log(facultybranch);
  res.render("attendance");
});

app.get("/markAttendance", function (req, res) {
  Student.find({}, function (err, foundStudent) {
    // console.log(foundStudent);
    if (foundStudent) {
      res.render("markAttendance", { List: foundStudent });
    }
  });
});

app.get("/viewAttendance", function (req, res) {
  Student.find({}, function (err, foundStudent) {
    if (foundStudent) {
      res.render("viewAttendance", {
        View: foundStudent,
      });
    }
  });
});

app.get("/setLecture", function (req, res) {
  res.render("setLecture");
});

app.get("/viewLecture", function (req, res) {
  Lecture.find({}, function (err, foundLecture) {
    if (foundLecture) {
      res.render("viewLecture", { scheduleLecture: foundLecture });
    }
  });
});

app.get("/updateLecture", function (req, res) {
  res.render("updateLecture");
});

app.post("/student", function (req, res) {
  const misId = req.body.studentMisId;
  const pass = req.body.studentPassword;
  Student.find(
    { $and: [{ MisID: misId }, { password: pass }] },
    function (err, foundStudent) {
      if (foundStudent) {
        // console.log(Student.email);
        res.render("studentData", {
          studentData: foundStudent,
        });
      }
    }
  );
});

app.get("/studentViewLecture",function (req,res) {
  res.render("studentViewLecture");
})

app.post("/faculty", function (req, res) {
  const email = req.body.facultyEmail;
  const pass = req.body.facultyPassword;
  Faculty.find(
    { $and: [{ email: email }, { password: pass }] },
    function (err, foundFaculty) {
      if (foundFaculty) {
        // console.log(Student.email);
        res.render("facultyData", {
          facultyData: foundFaculty,
        });
      } else {
        console.log("Not Found");
      }
    }
  );
});

app.post("/studentRegister", function (req, res) {
  const student = new Student({
    MisId: req.body.studentMisId,
    Name: req.body.studentName,
    email: req.body.studentEmail,
    number: req.body.studentNumber,
    dob: req.body.studentDob,
    doe: req.body.studentDoe,
    branch: req.body.studentBranch,
    password: req.body.studentPassword,
    total: 0,
    attendance: 0,
  });
  student.save();
  res.redirect("/student");
});

app.post("/facultyRegister", function (req, res) {
  facultybranch = req.body.branch;
  const faculty = new Faculty({
    Name: req.body.facultyName,
    email: req.body.facultyEmail,
    number: req.body.facultyNumber,
    subject: req.body.facultySubject,
    Branch: req.body.facultyBranch,
    password: req.body.facultyPassword,
  });
  faculty.save();
  res.redirect("/faculty");
});

app.post("/markAttendance", function (req, res) {
  const Attended = req.body.attended;
  if (!Attended) {
    res.render("error", { Error: "Select at least one student" });
  } else {
    for (let index = 0; index < Attended.length; index++) {
      Student.updateOne(
        { MisId: Attended[index] },
        { $inc: { attendance: 1, total: 1 } },
        function (err, foundStudent) {}
      );
    }
    res.redirect("/attendance");
  }
});

app.post("/setLecture", function (req, res) {
  // console.log(req.body);
  const lecture = new Lecture({
    subject: req.body.subjectName,
    startTime: req.body.subjectStartTime,
    endTime: req.body.subjectEndTime,
  });
  lecture.save();
  res.redirect("/viewLecture");
});

// app.post("/updateLecture", function (req, res) {
//   Lecture.UpdateOne(
//     { subject: req.body.updateName },
//     {
//       $set: {
//         startTime: req.body.updateStartTime,
//         endTime: req.body.updateEndTime,
//       },
//     },
//     function (err) {
//       if (err) {
//         console.log(err);
//       }
//     }
//   );
//   res.redirect("/viewLecture");
// });


app.listen(3000, function () {
  console.log("Server is listening on port 3000");
});
