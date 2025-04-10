document.addEventListener("DOMContentLoaded", function () {
  const courseForm = document.querySelector("#createCourseForm");
  const addSectionBtn = document.querySelector("#addSection");
  const sectionContainer = document.querySelector("#sectionContainer");
  const addPrerequisiteBtn = document.querySelector("#addPrerequisite");
  const prerequisitesContainer = document.querySelector("#prerequisites");
  const cancelBtn = document.querySelector(".btn-cancel");

  let sectionCounter = 1;

  addSectionBtn.addEventListener("click", function () {
    const newSection = document.createElement("div");
    newSection.className = "section-card";
    newSection.dataset.sectionIndex = sectionCounter;

    newSection.innerHTML = `
            <div class="form-group">
                <label for="section${sectionCounter}-crn">CRN:</label>
                <input type="text" id="section${sectionCounter}-crn" name="sections[${sectionCounter}].crn" placeholder="e.g., 10001" required>
            </div>
            <div class="form-group">
                <label for="section${sectionCounter}-instructor">Instructor:</label>
                <select id="section${sectionCounter}-instructor" name="sections[${sectionCounter}].instructor" required>
                    <option value="">Select an instructor</option>
                    <option value="Khalil">Dr. Khalil</option>
                    <option value="Mohammed">Dr. Mohammed</option>
                    <option value="Fatima">Dr. Fatima</option>
                    <option value="Ali">Dr. Ali</option>
                    <option value="Sara">Dr. Sara</option>
                </select>
            </div>
            <div class="form-group">
                <label for="section${sectionCounter}-schedule">Schedule:</label>
                <input type="text" id="section${sectionCounter}-schedule" name="sections[${sectionCounter}].schedule" placeholder="e.g., Mon/Wed 9:00-10:15 AM" required>
            </div>
            <div class="form-group">
                <label for="section${sectionCounter}-location">Location:</label>
                <input type="text" id="section${sectionCounter}-location" name="sections[${sectionCounter}].location" placeholder="e.g., Building 5, Room 203" required>
            </div>
        `;

    sectionContainer.appendChild(newSection);
    sectionCounter++;
  });

  addPrerequisiteBtn.addEventListener("click", function () {
    const courseCode = prompt("Enter prerequisite course code (e.g., CS 101):");
    if (courseCode && courseCode.trim() !== "") {
      addPrerequisiteTag(courseCode.trim());
    }
  });

  function addPrerequisiteTag(courseCode) {
    const tag = document.createElement("div");
    tag.className = "prerequisite-tag";
    tag.innerHTML = `
            <span>${courseCode}</span>
            <input type="hidden" name="prerequisites[]" value="${courseCode}">
        `;

    prerequisitesContainer.appendChild(tag);
  }

  courseForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const courseId = document.querySelector("#courseId").value.trim();
    const courseCode = document.querySelector("#courseCode").value.trim();
    const courseName = document.querySelector("#courseName").value.trim();
    const courseCategory = document
      .querySelector("#courseCategory")
      .value.trim();
    const courseDescription = document
      .querySelector("#courseDescription")
      .value.trim();

    const prerequisites = [
      ...document.querySelectorAll(
        "#prerequisites input[name='prerequisites[]']"
      ),
    ].map((input) => input.value.trim());

    const sections = [
      ...document.querySelectorAll("#sectionContainer .section-card"),
    ].map((section) => {
      const sectionIndex = section.dataset.sectionIndex;

      const crnElement = document.querySelector(`#section${sectionIndex}-crn`);
      const instructorElement = document.querySelector(
        `#section${sectionIndex}-instructor`
      );
      const scheduleElement = document.querySelector(
        `#section${sectionIndex}-schedule`
      );
      const locationElement = document.querySelector(
        `#section${sectionIndex}-location`
      );

      return {
        crn: crnElement.value.trim(),
        instructor: instructorElement.value.trim(),
        schedule: scheduleElement.value.trim(),
        location: locationElement.value.trim(),
        capacity: 30,
        enrolled: 0,
        status: "open",
      };
    });

    const courseData = {
      id: courseId,
      code: courseCode,
      name: courseName,
      credits: 3,
      category: courseCategory,
      description: courseDescription,
      prerequisites: prerequisites,
      sections: sections,
    };

    console.log(courseData);

    alert("Course created successfully!\n");
    // location.reload();
  });

  cancelBtn.addEventListener("click", function () {
    window.location.href = "../html/admin-home.html";
  });
});
