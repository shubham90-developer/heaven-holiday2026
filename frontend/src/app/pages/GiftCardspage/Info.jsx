import React, { useState } from "react";

const Info = () => {
  const [expanded, setExpanded] = useState(false);

  const text = `
Gift-giving is an integral part of our life. It is an important way to show love and affection for our family, friends, partners, and more. There are many reasons to give a gift, right from celebrating milestones and festivals to simply expressing appreciation and care. While giving gifts is certainly important, it is not easy to select the right gift for diverse occasions, particularly today, where gift options seem to be almost endless. This is why many people are opting for travel vouchers or trip gift cards instead of more traditional presents.

You would always want to impress your loved ones with the thoughtfulness of your gifts. However, not every gift will land as intended. You would not want your carefully chosen, well-meaning gift to end up in the back of a cupboard, collecting dust, as the recipient tries to hide their disappointment with the present. Therefore, to avoid this situation and effectively navigate the tricky waters of gift-giving, you should opt for something more flexible, like a gift card or voucher. A holiday season travel voucher, for instance, will allow your loved ones to enjoy a fun-filled vacation at a destination of their choice, and make sure that your gift is being put to good use.

The trend of experience-based gifting is slowly but steadily gaining momentum, as an increasing number of people shift their focus from traditional, physical gifts to memorable experiences that strengthen relationships and create lasting memories. Whether it is a tranquil beach retreat or a skydiving adventure, experiential gifts provide something that money can’t buy – unforgettable moments that are cherished for a lifetime. Therefore, instead of a new outfit or gadget that brings temporary happiness, why not gift your loved ones an experience that they will treasure forever?
`;

  const previewText = text.split(" ").slice(0, 60).join(" ") + "...";

  return (
    <section className="py-10 ">
      <div className="max-w-4xl mx-auto px-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Gift Cards</h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          {expanded ? text : previewText}
        </p>
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 text-blue-700 font-semibold text-sm flex items-center gap-1 hover:underline"
        >
          {expanded ? "Read Less ↑" : "Read More ↓"}
        </button>
      </div>
    </section>
  );
};

export default Info;
