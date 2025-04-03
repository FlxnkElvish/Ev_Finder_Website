document.addEventListener("DOMContentLoaded", function () {
    

    const themeSwitcher = document.getElementById("theme-switcher");

    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-theme");
        themeSwitcher.textContent = "Switch to Light Theme";
    }

    themeSwitcher.addEventListener("click", function () {
        document.body.classList.toggle("dark-theme");

        if (document.body.classList.contains("dark-theme")) {
            localStorage.setItem("theme", "dark");
            themeSwitcher.textContent = "Switch to Light Theme";
        } else {
            localStorage.setItem("theme", "light");
            themeSwitcher.textContent = "Switch to Dark Theme";
        }
    });
});
