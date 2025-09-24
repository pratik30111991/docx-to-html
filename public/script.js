const form = document.getElementById('uploadForm');
const preview = document.getElementById('preview');
const htmlOutput = document.getElementById('htmlOutput');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const fileInput = form.querySelector('input[name="docxFile"]');
  const formData = new FormData();
  formData.append('docxFile', fileInput.files[0]);

  const response = await fetch('/upload', { method: 'POST', body: formData });

  if (!response.ok) {
    alert('Error converting DOCX file!');
    return;
  }

  const htmlContent = await response.text();

  // Display converted HTML in preview
  preview.innerHTML = htmlContent;

  // Copy HTML tags to textarea
  htmlOutput.value = htmlContent;
});
