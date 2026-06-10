---js
{
  layout: "layouts/base.njk",
  eleventyNavigation: { key: "About", order: 3 },
  title: "About / CV",
  bodyClass: "page-cv",
  templateEngineOverride: "njk"
}
---
<!--
  This is an HTML rendering of a LaTeX-style CV (Computer Modern font).
  The "Download PDF" button uses the browser's print engine to save these two
  pages as a real, font-embedded PDF. The matching LaTeX source lives in
  cv/shekhar_cv.tex — edit both when you update your CV.
  Replace the placeholder bullet points below with your real details.
-->
<div class="cv-toolbar">
  <h1>Curriculum Vitae</h1>
  <button class="cv-download" id="cvDownload" type="button">
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
    Download PDF
  </button>
</div>

<div class="cv-wrap" id="cv">

  <!-- ===================== PAGE 1 ===================== -->
  <article class="cv-page">
    <header class="cv-head">
      <p class="cv-name">Shekhar Koirala</p>
      <p class="cv-role">Machine Learning Engineer</p>
      <p class="cv-contact">
        Dublin, Ireland
        <span class="sep">|</span>
        <a href="mailto:shekharkoirala4@gmail.com">shekharkoirala4@gmail.com</a>
        <span class="sep">|</span>
        <a href="https://shekharkoirala.github.io">shekharkoirala.github.io</a>
        <br>
        <a href="https://github.com/shekharkoirala">github.com/shekharkoirala</a>
        <span class="sep">|</span>
        <a href="https://linkedin.com/in/shekharkoirala">linkedin.com/in/shekharkoirala</a>
      </p>
    </header>

    <section class="cv-section">
      <h2>Summary</h2>
      <p class="cv-summary">
        Machine Learning Engineer with a strong software-engineering foundation,
        focused on taking ML systems from prototype to reliable production. Experience
        spans computer vision, data pipelines, and MLOps — building, deploying, and
        monitoring models on cloud and edge hardware. Comfortable across the full
        stack of a modern ML workflow: data sourcing, training, serving, and
        observability.
      </p>
    </section>

    <section class="cv-section">
      <h2>Experience</h2>

      <div class="cv-entry">
        <div class="cv-entry-head">
          <span><span class="cv-entry-title">Machine Learning Engineer</span>, <span class="cv-entry-org">Identv</span></span>
          <span class="cv-entry-date">Present</span>
        </div>
        <ul>
          <li>Design and ship computer-vision and identity-verification models into production services.</li>
          <li>Build data pipelines and model-serving infrastructure with an emphasis on reliability and latency.</li>
          <li>Own model evaluation, drift monitoring, and rollback strategy across the ML lifecycle.</li>
        </ul>
      </div>

      <div class="cv-entry">
        <div class="cv-entry-head">
          <span><span class="cv-entry-title">Software Engineer</span>, <span class="cv-entry-org">Ekbana</span></span>
          <span class="cv-entry-date">Earlier</span>
        </div>
        <ul>
          <li>Developed backend services and data-driven features for client products.</li>
          <li>Worked across the stack — APIs, databases, and deployment — in a fast-paced consultancy setting.</li>
        </ul>
      </div>
    </section>

    <section class="cv-section">
      <h2>Education</h2>

      <div class="cv-entry">
        <div class="cv-entry-head">
          <span><span class="cv-entry-title">M.Sc. Computer Science (OMSCS)</span>, <span class="cv-entry-org">Georgia Institute of Technology</span></span>
          <span class="cv-entry-date">Online</span>
        </div>
        <ul>
          <li>Specialization in Machine Learning / Computing Systems.</li>
        </ul>
      </div>

      <div class="cv-entry">
        <div class="cv-entry-head">
          <span><span class="cv-entry-title">B.E. Electronics &amp; Communication Engineering</span>, <span class="cv-entry-org">IOE, Thapathali Campus</span></span>
          <span class="cv-entry-date"></span>
        </div>
      </div>
    </section>

    <p class="cv-pagefoot">Shekhar Koirala — Curriculum Vitae — Page 1 of 2</p>
  </article>

  <!-- ===================== PAGE 2 ===================== -->
  <article class="cv-page">
    <section class="cv-section" style="margin-top:0">
      <h2>Technical Skills</h2>
      <dl class="cv-skills-grid">
        <dt>Languages</dt><dd>Python, SQL, Bash, JavaScript</dd>
        <dt>ML / DL</dt><dd>PyTorch, scikit-learn, TensorRT, computer vision, clustering</dd>
        <dt>MLOps</dt><dd>Prefect, Airflow, MLflow, model registries, drift detection</dd>
        <dt>Cloud</dt><dd>AWS (Lambda, S3, CloudWatch), Terraform, serverless</dd>
        <dt>Edge / HW</dt><dd>NVIDIA Jetson, CUDA, cuDNN, SDK Manager</dd>
        <dt>Tooling</dt><dd>Docker, Git, Pyenv / Pipenv / Poetry, FFmpeg</dd>
      </dl>
    </section>

    <section class="cv-section">
      <h2>Selected Projects &amp; Writing</h2>

      <div class="cv-entry">
        <div class="cv-entry-head">
          <span class="cv-entry-title">Robust MLOps Infrastructure</span>
          <span class="cv-entry-date">Blog</span>
        </div>
        <ul>
          <li>Pragmatic patterns for testing, drift detection, rollback, and flexible serving in production ML.</li>
        </ul>
      </div>

      <div class="cv-entry">
        <div class="cv-entry-head">
          <span class="cv-entry-title">Automated Image Clustering for E-commerce</span>
          <span class="cv-entry-date">Case study</span>
        </div>
        <ul>
          <li>Unsupervised pipeline to cluster product imagery at scale; from data sourcing to evaluation.</li>
        </ul>
      </div>

      <div class="cv-entry">
        <div class="cv-entry-head">
          <span class="cv-entry-title">NVIDIA Jetson + TensorRT Benchmarking</span>
          <span class="cv-entry-date">Guide</span>
        </div>
        <ul>
          <li>End-to-end setup of Jetson dev boards and TensorRT optimization of PyTorch models with benchmarks.</li>
        </ul>
      </div>
    </section>

    <section class="cv-section">
      <h2>Writing</h2>
      <ul>
        <li>Author of <a href="https://shekharkoirala.github.io">DumpDocs</a> — a personal blog on ML, AI, MLOps, and Python (15+ technical guides &amp; case studies).</li>
      </ul>
    </section>

    <section class="cv-section">
      <h2>Languages</h2>
      <dl class="cv-skills-grid">
        <dt>English</dt><dd>Professional</dd>
        <dt>Nepali</dt><dd>Native</dd>
      </dl>
    </section>

    <p class="cv-pagefoot">Shekhar Koirala — Curriculum Vitae — Page 2 of 2</p>
  </article>

</div>

<script>
(function() {
  var btn = document.getElementById('cvDownload');
  if (btn) btn.addEventListener('click', function() { window.print(); });
})();
</script>
