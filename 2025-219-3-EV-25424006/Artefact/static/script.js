document.addEventListener("DOMContentLoaded", function () {
    const sidebar = document.getElementById("sidebar");
    const openSidebarBtn = document.getElementById("openSidebar");
    const closeSidebarBtn = document.getElementById("closeSidebar");
    const toggleThemeBtn = document.getElementById("toggleTheme");

    
    const existingSidebarBtns = document.querySelectorAll("#openSidebar");
    if (existingSidebarBtns.length > 1) {
        console.warn("⚠️ Duplicate sidebar button found! Removing extras...");
        existingSidebarBtns.forEach((btn, index) => {
            if (index > 0) {
                btn.classList.add("duplicate"); 
                btn.remove(); 
            }
        });
    }

    
    if (openSidebarBtn) {
        openSidebarBtn.addEventListener("click", function () {
            sidebar.classList.add("open");
        });
    }

    if (closeSidebarBtn) {
        closeSidebarBtn.addEventListener("click", function () {
            sidebar.classList.remove("open");
        });
    }

    
    toggleThemeBtn.addEventListener("click", function () {
        document.body.classList.toggle("dark-theme");
        toggleThemeBtn.textContent = document.body.classList.contains("dark-theme")
            ? "🌞 Light Mode"
            : "🌙 Dark Mode";
    });

    
    if (window.location.pathname === "/" && !sessionStorage.getItem("popupDismissed")) {
        showUserPopup();
    }

    
    const questionnaireForm = document.getElementById("questionnaire-form");
    const resultContainer = document.getElementById("result-container");
    const clearResultsBtn = document.getElementById("clear-results");

    if (questionnaireForm && resultContainer) {
        questionnaireForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const email = localStorage.getItem("user_email");
            if (!email) {
                alert("⚠️ Please enter your details first!");
                return;
            }

            const formData = new FormData(this);
            formData.append("email", email);

            const queryString = new URLSearchParams(formData).toString();

            
            resultContainer.innerHTML = "<p>🔄 Searching for EVs...</p>";

            fetch(`/results?${queryString}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("❌ Failed to load results.");
                }
                return response.text();
            })
            .then(html => {
                resultContainer.innerHTML = html; 
                clearResultsBtn.style.display = "block"; 
            })
            .catch(error => {
                console.error("❌ Error loading results:", error);
                resultContainer.innerHTML = "<p style='color:red;'>❌ An error occurred. Please try again.</p>";
            });
        });

        clearResultsBtn.addEventListener("click", function () {
            resultContainer.innerHTML = "";  
            clearResultsBtn.style.display = "none";  
        });
    }
});


function showUserPopup() {
    const popupHtml = `
        <div id="userPopupOverlay"></div>
        <div id="userPopup" class="popup">
            <div class="popup-content">
                <h2>Enter Your Details</h2>
                <form id="userForm">
                    <label for="name">Full Name:</label>
                    <input type="text" id="name" name="name" required>

                    <label for="email">Email:</label>
                    <input type="email" id="email" name="email" required>

                    <label for="phone">Phone:</label>
                    <input type="text" id="phone" name="phone" required>

                    <label for="country">Country:</label>
                    <input type="text" id="country" name="country" required>

                    <button type="submit">Save & Continue</button>
                    <button type="button" id="skipPopup">Skip</button>
                </form>
            </div>
        </div>
    `;

    
    document.body.insertAdjacentHTML("beforeend", popupHtml);

    const userPopup = document.getElementById("userPopup");
    const overlay = document.getElementById("userPopupOverlay");

    
    userPopup.style.display = "block";
    overlay.style.display = "block";

    document.getElementById("userForm").addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const phone = document.getElementById("phone").value;
        const country = document.getElementById("country").value;

        fetch("/save-user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, phone, country })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert("Error: " + data.error);
            } else {
                localStorage.setItem("user_email", email);
                sessionStorage.setItem("popupDismissed", "true");
                userPopup.style.display = "none";
                overlay.style.display = "none";
            }
        })
        .catch(error => console.error("❌ Error saving user:", error));
    });

    
    document.getElementById("skipPopup").addEventListener("click", function () {
        sessionStorage.setItem("popupDismissed", "true");
        userPopup.style.display = "none";
        overlay.style.display = "none";
    });
}

