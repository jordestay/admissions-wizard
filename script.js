const steps = [
    {
      question: "Welcome! Ready to find your best-fit schools?",
      inputType: "none",
    },
    {
      question: "What’s your current GPA?",
      inputType: "number",
      placeholder: "Enter your GPA (0-4 scale)",
      validator: (value) => value >= 0 && value <= 4,
      suggestion: (value) =>
        value < 3.5 ? "Focus on schools with flexible GPA ranges." : "You're on track for top schools!",
    },
    {
      question: "What’s your SAT or ACT score?",
      inputType: "number",
      placeholder: "Enter your score (SAT: 400-1600, ACT: 1-36)",
      validator: (value) => value >= 400 && value <= 1600,
      suggestion: (value) =>
        value < 1200 ? "Consider emphasizing strong essays." : "Great scores! You're competitive academically.",
    },
    {
      question: "Do you hold leadership roles in extracurriculars?",
      inputType: "text",
      placeholder: "Yes/No",
      validator: (value) => ["yes", "no"].includes(value.toLowerCase()),
      suggestion: (value) =>
        value.toLowerCase() === "yes"
          ? "Highlight your leadership achievements in applications."
          : "Focus on community impact in your activities.",
    },
    {
      question: "Have you drafted your personal statement?",
      inputType: "text",
      placeholder: "Yes/No",
      validator: (value) => ["yes", "no"].includes(value.toLowerCase()),
      suggestion: (value) =>
        value.toLowerCase() === "yes"
          ? "Get feedback to refine your essays."
          : "Start drafting soon for a strong personal story.",
    },
  ];
  
  let currentStep = 0;
  
  function nextStep() {
    const stepContent = document.getElementById("step-content");
    const nextButton = document.getElementById("next-button");
  
    // If it's the last step, show results
    if (currentStep >= steps.length) {
      stepContent.innerHTML = "<h2>All Done!</h2><p>Check your email for more insights!</p>";
      nextButton.style.display = "none";
      return;
    }
  
    // Render current step question
    const step = steps[currentStep];
    if (step.inputType === "none") {
      stepContent.innerHTML = `<p>${step.question}</p>`;
    } else {
      stepContent.innerHTML = `
        <p>${step.question}</p>
        <input type="${step.inputType}" id="user-input" placeholder="${step.placeholder}" />
      `;
    }
  
    nextButton.onclick = function () {
      const inputElement = document.getElementById("user-input");
      if (inputElement) {
        const value = inputElement.value.trim();
        if (step.validator && !step.validator(value)) {
          alert("Please enter a valid input!");
          return;
        }
        alert(step.suggestion(value));
      }
      currentStep++;
      nextStep();
    };
  }
  
  // Initialize first step
  nextStep();
  


//   RADAR CHART LOGIC
let userScores = { GPA: 0, TestScores: 0, Extracurriculars: 0, Essays: 0, Recommendations: 0 };
const categories = ["GPA", "Test Scores", "Extracurriculars", "Essays", "Recommendations"];

function nextStep() {
  const stepContent = document.getElementById("step-content");
  const nextButton = document.getElementById("next-button");

  if (currentStep >= steps.length) {
    showResults(); // Show radar chart
    return;
  }

  const step = steps[currentStep];
  if (step.inputType === "none") {
    stepContent.innerHTML = `<p>${step.question}</p>`;
  } else {
    stepContent.innerHTML = `
      <p>${step.question}</p>
      <input type="${step.inputType}" id="user-input" placeholder="${step.placeholder}" />
    `;
  }

  nextButton.onclick = function () {
    const inputElement = document.getElementById("user-input");
    if (inputElement) {
      const value = inputElement.value.trim();
      if (step.validator && !step.validator(value)) {
        alert("Please enter a valid input!");
        return;
      }

      // Map values to user scores
      switch (currentStep) {
        case 1: userScores.GPA = value / 4; break;
        case 2: userScores.TestScores = value / 1600; break;
        case 3: userScores.Extracurriculars = value.toLowerCase() === "yes" ? 1 : 0.5; break;
        case 4: userScores.Essays = value.toLowerCase() === "yes" ? 1 : 0.5; break;
        default: break;
      }

      alert(step.suggestion(value));
    }
    currentStep++;
    nextStep();
  };
}

function showResults() {
    document.getElementById("step-container").style.display = "none";
    document.getElementById("results-container").style.display = "block";
  
    // Radar chart logic
    const ctx = document.getElementById("radarChart").getContext("2d");
    new Chart(ctx, {
      type: "radar",
      data: {
        labels: categories,
        datasets: [
          {
            label: "Your Profile",
            data: Object.values(userScores),
            backgroundColor: "rgba(255, 159, 64, 0.2)",
            borderColor: "rgba(255, 159, 64, 1)",
            borderWidth: 2,
          },
          {
            label: "School Benchmark",
            data: [1, 0.95, 0.9, 0.9, 0.85], // Example benchmark
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 2,
          },
        ],
      },
      options: {
        scales: {
          r: {
            beginAtZero: true,
            suggestedMax: 1,
          },
        },
      },
    });
  
    // Mentor recommendation logic
    const scoresArray = Object.values(userScores);
    const minScoreIndex = scoresArray.indexOf(Math.min(...scoresArray));
    const weakestCategory = categories[minScoreIndex];
  
    const mentorSuggestions = {
      "GPA": "Consider working with an academic mentor to strengthen your coursework strategy.",
      "Test Scores": "A test prep coach can help boost your SAT/ACT scores effectively.",
      "Extracurriculars": "Our leadership mentors can help you stand out in your extracurriculars.",
      "Essays": "Connect with an essay specialist to craft compelling personal statements.",
      "Recommendations": "Get guidance on securing impactful recommendation letters.",
    };
  
    const recommendationText = mentorSuggestions[weakestCategory];
  
    // Append mentor suggestion to the results
    const resultsContainer = document.getElementById("results-container");
    const mentorDiv = document.createElement("div");
    mentorDiv.innerHTML = `
      <h3>Recommendation</h3>
      <p>Your weakest area is <strong>${weakestCategory}</strong>.</p>
      <p>${recommendationText}</p>
    `;
    resultsContainer.appendChild(mentorDiv);
  }
  

nextStep();

// CSV DATABASE LOGIC

// // let userScores = { GPA: 0, TestScores: 0, Extracurriculars: 0, Essays: 0, Recommendations: 0 };
// // const categories = ["GPA", "Test Scores", "Extracurriculars", "Essays", "Recommendations"];
// let schoolsData = [];

// // Fetch and parse the CSV
// function loadCSVData(callback) {
//   Papa.parse("schools.csv", {
//     download: true,
//     header: true,
//     complete: function (results) {
//       schoolsData = results.data;
//       callback();
//     },
//   });
// }

// function calculateBestFit() {
//     let bestFit = null;
//     let bestScore = Infinity;
  
//     schoolsData.forEach((school) => {
//       let score = 0;
  
//       // Calculate differences between user input and school metrics
//       score += Math.abs(parseFloat(school.GPA) - userScores.GPA * 4);
//       const schoolSAT = parseInt(school["SAT Range"].split("-")[1]);  // Use highest SAT score from range
//       score += Math.abs(schoolSAT - userScores.TestScores * 1600);
//       // Extracurricular fit (scaled to 1-10 based on input weight):
//       score += Math.abs(10 - userScores.Extracurriculars * 10);  
//       score += Math.abs(10 - userScores.Essays * 10);  
//       score += Math.abs(10 - userScores.Recommendations * 10);
  
//       if (score < bestScore) {
//         bestFit = school;
//         bestScore = score;
//       }
//     });
  
//     return bestFit;
//   }

// // Show radar chart with fit
// function showResults() {
//     document.getElementById("step-container").style.display = "none";
//     document.getElementById("results-container").style.display = "block";
  
//     const bestFitSchool = calculateBestFit();
  
//     const ctx = document.getElementById("radarChart").getContext("2d");
//     new Chart(ctx, {
//       type: "radar",
//       data: {
//         labels: categories,
//         datasets: [
//           {
//             label: "Your Profile",
//             data: Object.values(userScores),
//             backgroundColor: "rgba(255, 159, 64, 0.2)",
//             borderColor: "rgba(255, 159, 64, 1)",
//             borderWidth: 2,
//           },
//           {
//             label: bestFitSchool.School,  // Dynamically set the school name
//             data: [
//               parseFloat(bestFitSchool.GPA) / 4,
//               parseFloat(bestFitSchool["SAT Range"].split("-")[1]) / 1600,
//               0.8, // Placeholder if extra weights exist
//               0.9,
//               0.8,
//             ],
//             backgroundColor: "rgba(54, 162, 235, 0.2)",
//             borderColor: "rgba(54, 162, 235, 1)",
//             borderWidth: 2,
//           },
//         ],
//       },
//       options: {
//         scales: {
//           r: {
//             beginAtZero: true,
//             suggestedMax: 1,
//           },
//         },
//       },
//     });
//   }
  

// // Initialize
// loadCSVData(nextStep);


