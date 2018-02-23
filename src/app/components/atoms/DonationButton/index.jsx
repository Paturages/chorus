import Inferno from "inferno";

import "./style.scss";

export default () =>
  process.env.NODE_ENV != "dev" && (
    <div
      className="DonationButton"
      title="...to be fair, chorus doesn't cost me anything but time, bandwidth and electricity to run and I actually have a decent job, but I will still love you very much if you're able to contribute."
    >
      <form
        action="https://www.paypal.com/cgi-bin/webscr"
        method="post"
        target="_blank"
      >
        <input type="hidden" name="cmd" value="_s-xclick" />
        <input type="hidden" name="hosted_button_id" value="NVJZ542XPXPJ6" />
        <input
          type="image"
          src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif"
          border="0"
          name="submit"
          alt="PayPal - The safer, easier way to pay online!"
        />
        <img
          alt=""
          border="0"
          src="https://www.paypalobjects.com/fr_FR/i/scr/pixel.gif"
          width="1"
          height="1"
        />
      </form>
    </div>
  );
