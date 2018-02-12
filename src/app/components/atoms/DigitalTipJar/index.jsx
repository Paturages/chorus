import Inferno from "inferno";

import "./style.scss";

export default () =>
  process.env.NODE_ENV != "dev" && (
    <div className="DigitalTipJar">
      <a
        href="https://digitaltipjar.com/paturages?_external=true"
        class="dtj-tip-button"
        data-username="paturages"
      >
        Digital Tip Jar
      </a>
      <script>
        var a = document.querySelectorAll('.dtj-tip-button')[0]; var i =
        document.createElement('IFRAME'); i.setAttribute('src',
        "https://digitaltipjar.com/paturages/widgets/tip?_external=true");
        i.setAttribute('frameborder','0'); i.style.height = 70 +'px';
        i.style.width = 120 +'px'; a.parentNode.insertBefore(i,a);
        a.parentNode.removeChild(a);
      </script>
      <div className="DigitalTipJar__label">{"<-- Donate here!"}</div>
    </div>
  );
