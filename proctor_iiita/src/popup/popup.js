let showStatusInterval = null;
let showInfoInterval = null;


// cache description
function showCache() {
  let cachedActivities = JSON.parse(localStorage.getItem("cache"));
  if (localStorage.getItem("cache") != null) {
    console.log('trying to show cache');
    console.log(cachedActivities);
    cachedActivities.forEach((e, idx) => {
      let selector = `div.item.item-${idx + 1}`;
      console.log(document.querySelector(selector));
      document.querySelector(selector).style.display = "block";
      let textSelector = `div.description.item-${idx + 1}`;
      document.querySelector(textSelector).innerHTML = e.message;
    });
  }
}

// status if the user has any suspicious activity or not
function showStatus() {
  let activities = Number(localStorage.getItem("flag"));
  console.log('trying to show status');
  console.log(localStorage.getItem("flag"));
  if (activities != null) {
    if (activities > 1) {
      document.querySelector("#status").innerHTML = "Status: Suspicious Activity";
      document.querySelector("#status").style.color = "red";
    } else {
      document.querySelector("#status").innerHTML = "Status: No Suspicious Activity";
      document.querySelector("#status").style.color = "green";
    }
  }

}


function startCache() {
  showInfoInterval = setInterval(showCache, 1000);
}

function startStatus() {
  showStatusInterval = setInterval(showStatus, 1000);
}

function showNewUserStuff() {
  document
    .querySelectorAll(".new-user-stuff")
    .forEach((e) => (e.style.display = "block"));
  document
    .querySelectorAll(".old-user-stuff")
    .forEach((e) => (e.style.display = "none"));
}

function showOldUserStuff(user) {
  document
    .querySelectorAll(".old-user-stuff")
    .forEach((e) => (e.style.display = "block"));
  document
    .querySelectorAll(".new-user-stuff")
    .forEach((e) => (e.style.display = "none"));
  document.querySelector("#user-name").innerHTML = user.name;
  document.querySelector("#user-email").innerHTML = user.email;

  if (localStorage.getItem("code") == null) {
    showCodeNotSet();
  } else {
    showCodeSet();
  }
}

function showCodeNotSet() {
  document
    .querySelectorAll(".code-not-set")
    .forEach((e) => (e.style.display = "block"));
  document
    .querySelectorAll(".code-set")
    .forEach((e) => (e.style.display = "none"));
}

function showCodeSet() {
  const code = localStorage.getItem("code");
  document
    .querySelectorAll(".code-set")
    .forEach((e) => (e.style.display = "block"));
  document
    .querySelectorAll(".code-not-set")
    .forEach((e) => (e.style.display = "none"));
  document.querySelector("input#code").value = code;

  if (localStorage.getItem("tracking") == null) {
    stopTracking();
  } else {
    showTracking();
  }
}

function showTracking() {

  document
    .querySelectorAll(".tracking-enabled")
    .forEach((e) => (e.style.display = "block"));

  document.querySelector("#tracking").checked = true;
  document.querySelector("#tracking-message").innerHTML = "Tracking Enabled";
  startStatus();
  startCache();
}

function stopTracking() {
  document
    .querySelectorAll(".tracking-enabled")
    .forEach((e) => (e.style.display = "none"));

  document.querySelector("#tracking").checked = false;
  document.querySelector("#tracking-message").innerHTML = "Tracking Disabled";
  localStorage.removeItem("activities");
  localStorage.removeItem("cache");
  localStorage.removeItem("flag");

  document.querySelector("#status").innerHTML = "Status: No Suspicious Activity";
  document.querySelector("#status").style.color = "green";

  for (var idx = 0; idx < 5; ++idx) {
    let selector = `div.item.item-${idx + 1}`;
    document.querySelector(selector).style.display = "none";
    let textSelector = `div.description.item-${idx + 1}`;
    document.querySelector(textSelector).innerHTML = "";
  }

  clearInterval(showStatusInterval);
  clearInterval(showInfoInterval);
  // document.querySelector("#status").innerHTML = "";
}

function setCode(code) {
  localStorage.setItem("code", code);
  displayUserStuff();
}

function setUser(user) {
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.getItem("activities") == null ?
    localStorage.setItem("activities", JSON.stringify([])) :
    localStorage.setItem("activities", JSON.stringify(JSON.parse(localStorage.getItem("activities"))));
  localStorage.setItem("cache", JSON.stringify([]));
  localStorage.setItem("flag", 0);
  displayUserStuff();
}

function removeCode() {
  localStorage.removeItem("code");
  displayUserStuff();
}

function removeUser() {
  localStorage.removeItem("user");
  localStorage.removeItem("code");
  localStorage.removeItem("tracking");
  document.querySelector("input#code").value = "";
  displayUserStuff();
}

function toggleTracking() {
  const current = localStorage.getItem("tracking");
  if (current == null) {
    localStorage.setItem("tracking", "true");
  } else {
    localStorage.removeItem("tracking");
  }
  displayUserStuff();
}

function displayUserStuff() {
  if (localStorage.getItem("user") == null) {
    showNewUserStuff();
  } else {
    const user = JSON.parse(localStorage.getItem("user"));
    showOldUserStuff(user);
  }
}

window.onload = () => {
  document.querySelector("button#sign-up").addEventListener("click", () => {
    chrome.identity.getAuthToken({ interactive: true }, (token) => {
      if (chrome.runtime.lastError) {
        console.log(chrome.runtime.lastError.message);
        return;
      }
      // chrome.identity.getProfileUserInfo((userInfo) => {
      //     console.log(`Auth token: ${token}`);
      //     console.log(`User info: ${JSON.stringify(userInfo)}`);
      // });

      let requestOptions = {
        method: "GET",
        redirect: "follow",
      };

      fetch(
        "https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=" +
        token,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => setUser(result))
        .catch((error) => {
          localStorage.setItem("token", token);
          removeUser();
          console.log("error", error);
        });
    });
  });

  document.querySelector("button#logout").addEventListener("click", () => {
    removeUser();
  });

  document.querySelector("button#save").addEventListener("click", () => {
    const val = document.querySelector("input#code").value;
    if (val !== "") {
      setCode(val);
    } else {
      removeCode();
    }
  });

  document.querySelector("button#clear").addEventListener("click", () => {
    document.querySelector("input#code").value = "";
    removeCode();
  });

  document.querySelector("input#tracking").addEventListener("change", () => {
    toggleTracking();
  });

  displayUserStuff();
};
