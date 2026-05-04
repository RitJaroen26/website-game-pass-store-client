// ไฟล์ navbar.js
document.addEventListener("DOMContentLoaded", async () => {
  // 1. โหลด HTML ของ Navbar มาใส่ในกล่อง navbar-placeholder
  try {
    const response = await fetch("navbar.html");
    const html = await response.text();
    document.getElementById("navbar-placeholder").innerHTML = html;

    // 2. เมื่อโหลด HTML เสร็จ ค่อยรันสคริปต์ตรวจสอบ Login
    initNavbarLogic();
  } catch (error) {
    console.error("โหลด Navbar ไม่สำเร็จ:", error);
  }
});

function initNavbarLogic() {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");

  const btnNavLogin = document.getElementById("btn-nav-login");
  const navProfile = document.getElementById("nav-profile");
  const navUsername = document.getElementById("nav-username");
  const navUsernameMobile = document.getElementById("nav-username-mobile");
  const btnLogout = document.getElementById("btn-logout");
  const navWallet = document.getElementById("nav-wallet");
  const navBalance = document.getElementById("nav-balance");

  async function fetchWalletBalance(authToken) {
    try {
      const response = await fetch("http://localhost:4000/api/wallet", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (navBalance && result.data && result.data.balance !== undefined) {
          navBalance.innerText = `฿${parseFloat(result.data.balance).toLocaleString("th-TH", { minimumFractionDigits: 2 })}`;
        }
      }
    } catch (error) {
      console.error("ไม่สามารถดึงข้อมูลยอดเงินได้:", error);
    }
  }

  if (token) {
    if (btnNavLogin) btnNavLogin.classList.add("hidden");
    if (navProfile) navProfile.classList.remove("hidden");

    if (navWallet) {
      navWallet.classList.remove("hidden");
      navWallet.classList.add("flex");
    }

    fetchWalletBalance(token);

    try {
      if (userStr && userStr !== "undefined" && userStr !== "null") {
        const user = JSON.parse(userStr);
        if (user && user.email) {
          const displayName = user.email.split("@")[0];
          if (navUsername) navUsername.innerText = displayName;
          if (navUsernameMobile) navUsernameMobile.innerText = displayName;
        }
      } else {
        if (navUsername) navUsername.innerText = "Player";
        if (navUsernameMobile) navUsernameMobile.innerText = "Player";
      }
    } catch (error) {
      console.warn("ไม่สามารถอ่านข้อมูล User ได้ แต่ยังคงล็อกอินอยู่:", error);
      if (navUsername) navUsername.innerText = "Player";
      if (navUsernameMobile) navUsernameMobile.innerText = "Player";
    }
  } else {
    if (navWallet) {
      navWallet.classList.add("hidden");
      navWallet.classList.remove("flex");
    }
  }

  if (btnLogout) {
    btnLogout.addEventListener("click", () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.reload();
    });
  }
}
