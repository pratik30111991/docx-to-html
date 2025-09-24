document.getElementById("uploadForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const file = document.getElementById("docx").files[0];
  if (!file) {
    alert("Please upload a DOCX file");
    return;
  }

  const formData = new FormData();
  formData.append("docx", file);

  const response = await fetch("/convert", {
    method: "POST",
    body: formData
  });

  const html = await response.text();
  document.getElementById("result").innerHTML = html;
});
