

const body = document.body;
const themeBtn = document.getElementById("themeBtn");
const themeText = document.getElementById("themeText");

// Search
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

// Battle
const battleModeBtn = document.getElementById("battleModeBtn");
const battleContainer = document.querySelector(".battle-container");

const userOne = document.getElementById("userOne");
const userTwo = document.getElementById("userTwo");
const battleBtn = document.getElementById("battleBtn");

// Loading
const loading = document.getElementById("loading");

// Error
const errorBox = document.getElementById("errorBox");

// Profile Card
const profileCard = document.getElementById("profileCard");

// Repo
const repoSection = document.getElementById("repoSection");
const repoList = document.getElementById("repoList");

// Battle Result
const battleResult = document.getElementById("battleResult");
const winnerCard = document.getElementById("winnerCard");
const loserCard = document.getElementById("loserCard");

// Profile Data
const avatar = document.getElementById("avatar");
const nameEl = document.getElementById("name");
const username = document.getElementById("username");
const joined = document.getElementById("joined");
const bio = document.getElementById("bio");

const repos = document.getElementById("repos");
const followers = document.getElementById("followers");
const following = document.getElementById("following");

const locationEl = document.getElementById("location");
const website = document.getElementById("website");
const twitter = document.getElementById("twitter");
const company = document.getElementById("company");


/*==========================================================
                    API URL
==========================================================*/

const API = "https://api.github.com/users/";


/*==========================================================
                    THEME TOGGLE
==========================================================*/

themeBtn.addEventListener("click", () => {

    body.classList.toggle("light");

    if (body.classList.contains("light")) {

        themeText.innerText = "LIGHT";

    } else {

        themeText.innerText = "DARK";

    }

});


/*==========================================================
                    SHOW LOADING
==========================================================*/

function showLoading() {

    loading.classList.remove("hidden");

    profileCard.classList.add("hidden");

    errorBox.classList.add("hidden");

    repoSection.classList.add("hidden");

    battleResult.classList.add("hidden");

}


/*==========================================================
                    HIDE LOADING
==========================================================*/

function hideLoading() {

    loading.classList.add("hidden");

}


/*==========================================================
                    SHOW ERROR
==========================================================*/

function showError() {

    errorBox.classList.remove("hidden");

    profileCard.classList.add("hidden");

    repoSection.classList.add("hidden");

}


/*==========================================================
                    HIDE ERROR
==========================================================*/

function hideError() {

    errorBox.classList.add("hidden");

}


/*==========================================================
                    FORMAT DATE
==========================================================*/

function formatDate(date) {

    const options = {

        day: "numeric",

        month: "short",

        year: "numeric"

    };

    return new Date(date).toLocaleDateString(
        "en-GB",
        options
    );

}


/*==========================================================
            SET DEFAULT VALUE IF NULL
==========================================================*/

function setValue(value) {

    if (value === null || value === "") {

        return "Not Available";

    }

    return value;

}


/*==========================================================
                CLEAR OLD DATA
==========================================================*/

function clearOldData() {

    repoList.innerHTML = "";

    winnerCard.innerHTML = "";

    loserCard.innerHTML = "";

}


/*==========================================================
                BATTLE MODE TOGGLE
==========================================================*/

battleModeBtn.addEventListener("click", () => {

    battleContainer.classList.toggle("hidden");

});


/*==========================================================
                    SEARCH ON ENTER
==========================================================*/

searchInput.addEventListener("keypress", (event) => {

    if (event.key === "Enter") {

        searchBtn.click();

    }

});


/*==========================================================
                    PROJECT READY
==========================================================*/

console.log("Dev Detective Ready...");

/*==========================================================
                FETCH GITHUB USER
==========================================================*/

async function getUser(usernameValue) {

    showLoading();

    hideError();

    clearOldData();

    try {

        const response = await fetch(API + usernameValue);

        if (!response.ok) {

            throw new Error("User Not Found");

        }

        const data = await response.json();

        hideLoading();

        displayUser(data);

        await getRepositories(data.repos_url);

    }

    catch (error) {

        hideLoading();

        showError();

        console.error(error);

    }

}


/*==========================================================
                DISPLAY USER
==========================================================*/

function displayUser(data) {

    profileCard.classList.remove("hidden");

    avatar.src = data.avatar_url;

    avatar.alt = data.login;

    nameEl.innerText = data.name || data.login;

    username.innerText = "@" + data.login;

    username.href = data.html_url;

    joined.innerText =
        "Joined " + formatDate(data.created_at);

    bio.innerText =
        data.bio || "This profile has no bio.";

    repos.innerText = data.public_repos;

    followers.innerText = data.followers;

    following.innerText = data.following;

    locationEl.innerText =
        setValue(data.location);

    company.innerText =
        setValue(data.company);

    twitter.innerText =
        setValue(data.twitter_username);


    if (data.blog) {

        website.innerText = data.blog;

        website.href = data.blog;

        website.style.pointerEvents = "auto";

    }

    else {

        website.innerText = "Not Available";

        website.removeAttribute("href");

        website.style.pointerEvents = "none";

    }

}


/*==========================================================
                SEARCH BUTTON
==========================================================*/

searchBtn.addEventListener("click", () => {

    const usernameValue =
        searchInput.value.trim();

    if (usernameValue === "") {

        alert("Please enter a GitHub username.");

        return;

    }

    getUser(usernameValue);

});


/*==========================================================
                DEFAULT PROFILE
==========================================================*/

window.addEventListener("DOMContentLoaded", () => {

    getUser("octocat");

});

/*==========================================================
                FETCH REPOSITORIES
==========================================================*/

async function getRepositories(repoUrl) {

    try {

        const response = await fetch(repoUrl);

        if (!response.ok) {

            throw new Error("Repository Fetch Failed");

        }

        const reposData = await response.json();

        displayRepositories(reposData);

    }

    catch (error) {

        console.error(error);

    }

}


/*==========================================================
                DISPLAY TOP 5 REPOSITORIES
==========================================================*/

function displayRepositories(repositories) {

    repoSection.classList.remove("hidden");

    repoList.innerHTML = "";

    // Latest repositories first
    const latestRepos = repositories
        .sort((a, b) =>
            new Date(b.created_at) - new Date(a.created_at)
        )
        .slice(0, 5);

    if (latestRepos.length === 0) {

        repoList.innerHTML = `

            <div class="repo-card">

                <h3>No Repository Found</h3>

                <p>This user doesn't have any public repositories.</p>

            </div>

        `;

        return;

    }

    latestRepos.forEach(repo => {

        const repoCard = document.createElement("div");

        repoCard.className = "repo-card";

        repoCard.innerHTML = `

            <h3>

                <a
                    href="${repo.html_url}"
                    target="_blank">

                    ${repo.name}

                </a>

            </h3>

            <p>

                ${repo.description || "No description available."}

            </p>

            <div class="repo-info">

                <span>⭐ ${repo.stargazers_count}</span>

                <span>🍴 ${repo.forks_count}</span>

                <span>👀 ${repo.watchers_count}</span>

                <span>💻 ${repo.language || "N/A"}</span>

            </div>

        `;

        repoList.appendChild(repoCard);

    });

}


/*==========================================================
            OPTIONAL: SEARCH AGAIN AFTER CLEARING
==========================================================*/

searchInput.addEventListener("focus", () => {

    errorBox.classList.add("hidden");

});


/*==========================================================
                PROJECT STATUS
==========================================================*/

console.log("Repositories Module Loaded...");

/*==========================================================
                BATTLE MODE
==========================================================*/

battleBtn.addEventListener("click", async () => {

    const firstUser = userOne.value.trim();
    const secondUser = userTwo.value.trim();

    if (firstUser === "" || secondUser === "") {

        alert("Please enter both GitHub usernames.");

        return;
    }

    battleResult.classList.add("hidden");

    winnerCard.innerHTML = "";
    loserCard.innerHTML = "";

    showLoading();

    try {

        /*==========================================
                    BOTH USERS
        ==========================================*/

        const [userOneResponse, userTwoResponse] =
            await Promise.all([

                fetch(API + firstUser),
                fetch(API + secondUser)

            ]);


        if (!userOneResponse.ok || !userTwoResponse.ok) {

            throw new Error("Invalid Username");

        }


        const [userOneData, userTwoData] =
            await Promise.all([

                userOneResponse.json(),
                userTwoResponse.json()

            ]);


        /*==========================================
                BOTH REPOSITORIES
        ==========================================*/

        const [repoOneResponse, repoTwoResponse] =
            await Promise.all([

                fetch(userOneData.repos_url),
                fetch(userTwoData.repos_url)

            ]);


        const [repoOneData, repoTwoData] =
            await Promise.all([

                repoOneResponse.json(),
                repoTwoResponse.json()

            ]);


        /*==========================================
                    TOTAL STARS
        ==========================================*/

        const totalStarsUserOne =
            repoOneData.reduce((total, repo) => {

                return total + repo.stargazers_count;

            }, 0);


        const totalStarsUserTwo =
            repoTwoData.reduce((total, repo) => {

                return total + repo.stargazers_count;

            }, 0);


        hideLoading();


        /*==========================================
                    WINNER
        ==========================================*/

        if (totalStarsUserOne >= totalStarsUserTwo) {

            showBattleResult(

                userOneData,
                totalStarsUserOne,

                userTwoData,
                totalStarsUserTwo

            );

        }

        else {

            showBattleResult(

                userTwoData,
                totalStarsUserTwo,

                userOneData,
                totalStarsUserOne

            );

        }

    }

    catch (error) {

        hideLoading();

        showError();

        console.error(error);

    }

});

/*==========================================================
                SHOW BATTLE RESULT
==========================================================*/

function showBattleResult(

    winner,
    winnerStars,

    loser,
    loserStars

) {

    battleResult.classList.remove("hidden");

    winnerCard.className = "winner";

    loserCard.className = "loser";


    winnerCard.innerHTML = `

        <div class="battle-profile">

            <img
                src="${winner.avatar_url}"
                alt="${winner.login}"
                class="battle-avatar">

            <div>

                <h2 class="result-title">

                    🏆 Winner

                </h2>

                <h3>

                    ${winner.name || winner.login}

                </h3>

                <p>

                    @${winner.login}

                </p>

                <p class="total-stars">

                    ⭐ Total Stars :
                    ${winnerStars}

                </p>

                <p>

                    📦 Public Repositories :
                    ${winner.public_repos}

                </p>

                <p>

                    👥 Followers :
                    ${winner.followers}

                </p>

                <a
                    href="${winner.html_url}"
                    target="_blank">

                    Visit GitHub Profile

                </a>

            </div>

        </div>

    `;



    loserCard.innerHTML = `

        <div class="battle-profile">

            <img
                src="${loser.avatar_url}"
                alt="${loser.login}"
                class="battle-avatar">

            <div>

                <h2 class="result-title">

                    ❌ Loser

                </h2>

                <h3>

                    ${loser.name || loser.login}

                </h3>

                <p>

                    @${loser.login}

                </p>

                <p class="total-stars">

                    ⭐ Total Stars :
                    ${loserStars}

                </p>

                <p>

                    📦 Public Repositories :
                    ${loser.public_repos}

                </p>

                <p>

                    👥 Followers :
                    ${loser.followers}

                </p>

                <a
                    href="${loser.html_url}"
                    target="_blank">

                    Visit GitHub Profile

                </a>

            </div>

        </div>

    `;

}


/*==========================================================
                BATTLE COMPLETE
==========================================================*/

console.log("Battle Mode Loaded Successfully...");

/*==========================================================
                HANDLE API ERRORS
==========================================================*/

function handleApiError(status) {

    hideLoading();

    profileCard.classList.add("hidden");

    repoSection.classList.add("hidden");

    battleResult.classList.add("hidden");

    errorBox.classList.remove("hidden");

    const title = errorBox.querySelector("h2");
    const para = errorBox.querySelector("p");

    if (status === 404) {

        title.innerText = "User Not Found";

        para.innerText =
            "Please enter a valid GitHub username.";

    }

    else if (status === 403) {

        title.innerText = "API Rate Limit Exceeded";

        para.innerText =
            "GitHub has temporarily blocked requests. Try again later or use a Personal Access Token.";

    }

    else {

        title.innerText = "Something Went Wrong";

        para.innerText =
            "Please try again.";

    }

}

/*==========================================================
            DISABLE SEARCH BUTTON
==========================================================*/

function disableSearch() {

    searchBtn.disabled = true;

    searchBtn.innerText = "Loading...";

}

function enableSearch() {

    searchBtn.disabled = false;

    searchBtn.innerText = "Search";

}

function disableBattle() {

    battleBtn.disabled = true;

    battleBtn.innerText = "Comparing...";

}

function enableBattle() {

    battleBtn.disabled = false;

    battleBtn.innerText = "Compare";

}

