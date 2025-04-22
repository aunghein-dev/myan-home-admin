const api = "https://mvlink-backend-webservice.onrender.com/mapi";
const brokenAPI = "https://mvlink-backend-webservice.onrender.com/brokenlink";
let movies = [];



async function fetchMovies() {
  const res = await fetch(`${api}/movies`);
  movies = await res.json();
  renderMovies(movies);
}

function renderMovies(filtered = movies) {
  const table = document.getElementById("movieTable");
  table.innerHTML = "";

  filtered.forEach(movie => {
    table.innerHTML += `
      <tr class="border-b border-gray-700 hover:bg-gray-700 transition duration-200">
        <td class="p-2">${movie.tmdbId}</td>
        <td class="p-2">${movie.moiveName || "-"}</td>
        <td class="p-2">${movie.sharedProviderName || "-"}</td>
        <td class="p-2">${movie.resolutionDesc || "-"}</td>
        <td class="p-2">${movie.fileSize || "-"}</td>
        <td class="p-2 break-words max-w-xs">
          <a href="${movie.sharedLink}" target="_blank" class="text-blue-400 underline hover:text-blue-300">Link</a>
        </td>
        <td class="p-2 flex gap-3">
          <button class="text-yellow-400 hover:text-yellow-300" onclick='editMovie(${JSON.stringify(movie)})'>
            <i data-feather="edit"></i>
          </button>
          <button class="text-red-500 hover:text-red-400" onclick="deleteMovie(${movie.tmdbId})">
            <i data-feather="trash-2"></i>
          </button>
        </td>
      </tr>
    `;
  });
  feather.replace(); // Render feather icons  
}


document.getElementById("movieForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const payload = {
    movieId: movies.length + 1,
    moiveName: document.getElementById("movieName").value,
    tmdbId: parseInt(document.getElementById("tmdbId").value),
    sharedLink: document.getElementById("sharedLink").value,
    sharedProviderName: document.getElementById("providerName").value,
    fileSize: document.getElementById("fileSize").value,
    resolutionDesc: document.getElementById("resolution").value,
    linkUploadDate: new Date().toISOString(),
    linkUpdateDate: new Date().toISOString(),
  };

  // Send POST request to the server
  await fetch(`${api}/movies`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  // Fetch the updated movies and reset the form
  fetchMovies();
  e.target.reset();

  // Show success toast
  showToast("Movie added successfully.");
});


function editMovie(movie) {
  document.getElementById("tmdbId").value = movie.tmdbId;
  document.getElementById("movieName").value = movie.moiveName;
  document.getElementById("providerName").value = movie.sharedProviderName;
  document.getElementById("sharedLink").value = movie.sharedLink;
  document.getElementById("resolution").value = movie.resolutionDesc;
  document.getElementById("fileSize").value = movie.fileSize;
}

async function deleteMovie(tmdbId) {
  if (confirm("Are you sure you want to delete this movie?")) {
    await fetch(`${api}/movies/${tmdbId}`, { method: "DELETE" });
    fetchMovies();
  }
}


let movieToDelete = null;



// --- Delete Modal ---
function deleteMovie(tmdbId) {
  movieToDelete = tmdbId;
  document.getElementById("deleteModal").classList.remove("hidden");
}

function closeDeleteModal() {
  movieToDelete = null;
  document.getElementById("deleteModal").classList.add("hidden");
}

async function confirmDelete() {
  if (!movieToDelete) return;
  await fetch(`${api}/movies/${movieToDelete}`, { method: "DELETE" });
  movieToDelete = null;
  closeDeleteModal();
  fetchMovies();
  showToast("Movie deleted successfully.");
}

document.getElementById("searchInput").addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();
  const filtered = movies.filter(m =>
    m.moiveName?.toLowerCase().includes(query) ||
    m.sharedProviderName?.toLowerCase().includes(query)
  );
  renderMovies(filtered);
});

fetchMovies();

function showToast(message) {
  const toast = document.getElementById("toast");
  const msg = document.getElementById("toastMsg");

  msg.textContent = message;

  // Show the toast
  toast.classList.remove("opacity-0", "translate-y-6", "scale-95", "pointer-events-none");
  toast.classList.add("opacity-100", "translate-y-0", "scale-100");

  // Auto hide after 3.5 seconds
  setTimeout(() => {
    toast.classList.remove("opacity-100", "translate-y-0", "scale-100");
    toast.classList.add("opacity-0", "translate-y-6", "scale-95", "pointer-events-none");
  }, 3500);
}


function showToast(message) {
  const toast = document.getElementById("toast");
  const msg = document.getElementById("toastMsg");

  msg.textContent = message;

  toast.classList.remove("opacity-0", "translate-y-6", "scale-95", "pointer-events-none");
  toast.classList.add("opacity-100", "translate-y-0", "scale-100");

  setTimeout(() => {
    toast.classList.remove("opacity-100", "translate-y-0", "scale-100");
    toast.classList.add("opacity-0", "translate-y-6", "scale-95", "pointer-events-none");
  }, 3500);
}

function verifyPasscode() {
  const input = document.getElementById("passcodeInput").value;
  const correctPasscode = "flixadmin";

  if (input === correctPasscode) {
    document.getElementById("passcodeGate").classList.add("hidden");
    document.getElementById("movieFormSection").classList.remove("hidden");
    showToast("\uD83D\uDD13 Access granted");
  } else {
    showToast("\u274C Incorrect passcode");
  }
}

let brokenReports = [];
async function fetchBrokenLink(){
    const res = await fetch(`${brokenAPI}/get`);
    brokenReports = await res.json();
    renderBrokenLinkSession(brokenReports);
}


function renderBrokenLinkSession(brokenReports){
  const brokenTable = document.getElementById("brokenLinksTable");
  brokenReports.forEach((report) => {
    brokenTable.innerHTML += `
      <tr class="border-b border-gray-700">
        <td class="p-3">${report.tmdb_id}</td>
        <td class="p-3">${report.movie_name}</td>
        <td class="p-3 break-all">${report.broken_link}</td>
        <td class="p-3">${report.description}</td>
        <td class="p-3">${report.ip}</td>
        <td class="p-3">${report.location}</td>
        <td class="p-3">
          <button class="text-sm bg-red-600 hover:bg-red-700 px-3 py-1 rounded">Fix</button>
        </td>
      </tr>
    `;
  });
  
}


fetchBrokenLink();