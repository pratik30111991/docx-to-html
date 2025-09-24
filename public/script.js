const uploadForm = document.getElementById("uploadForm");
const editorContainer = document.getElementById("editorContainer");
const htmlEditor = document.getElementById("htmlEditor");
const preview = document.getElementById("preview");
const copyHtmlBtn = document.getElementById("copyHtmlBtn");
const tabPreview = document.getElementById("tabPreview");
const tabHtml = document.getElementById("tabHtml");

uploadForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const fileInput = uploadForm.querySelector("input[name='docxFile']");
  const formData = new FormData();
  formData.append("docxFile", fileInput.files[0]);

  const res = await fetch("/upload", { method: "POST", body: formData });
  const html = await res.text();

  // show editor container
  editorContainer.style.display = "block";
  
  // set editor and preview
  htmlEditor.value = html;
  preview.innerHTML = html;
  htmlEditor.style.display = "none";
  tabPreview.classList.add("active");
  tabHtml.classList.remove("active");
});

// tab switch
tabPreview.addEventListener("click", () => {
  htmlEditor.style.display = "none";
  preview.style.display = "block";
  tabPreview.classList.add("active");
  tabHtml.classList.remove("active");
});
tabHtml.addEventListener("click", () => {
  htmlEditor.style.display = "block";
  preview.style.display = "none";
  tabHtml.classList.add("active");
  tabPreview.classList.remove("active");
});

// live preview update
htmlEditor.addEventListener("input", () => {
  preview.innerHTML = htmlEditor.value;
});

// copy HTML
copyHtmlBtn.addEventListener("click", () => {
  htmlEditor.select();
  document.execCommand("copy");
  alert("HTML copied to clipboard!");
});
