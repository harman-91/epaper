const meta = {
  "epaper.naidunia.com": {
    title:
      "NaiDunia Epaper: Daily MP Newspaper and Chhattisgarh News Paper Online",
    desc: "NaiDunia MP Epaper & CG Epaper in Hindi: Enjoy the NaiDunia Newspaper of your city/region online on your mobile and desktop devices. Check All Latest News of Madhya Pradesh and Chhattisgarh News Online Here",
    keywords:
      "naidunia epaper, nai dunia, naidunia newspaper, hidni newspaper, hindi epaper, mp newspaper, chhattisgarh newspaper",
    canonical: "https://epaper.naidunia.com",
  },
  "epaper.jagran.com": {
    title:
      "Dainik Jagran ePaper: Hindi News Paper, Today Newspaper, Online Hindi Epaper",
    desc: "Jagran ePaper - Dainik Jagran, Hindi newspaper known worldwide for its largest readership, is available now online at epaper.jagran.com, a hindi Epaper where you enjoy the Jagran Newspaper of your city/region online on your mobile and desktop devices",
    keywords: "Jagran epaper, hindi newspaper, hindi epaper",
    canonical: "https://epaper.jagran.com",
  },
  "epaper.punjabijagran.com": {
    title:
      "Punjabi Jagran ePaper: Read Latest Punjabi ePaper News, Online Punjabi ePaper News",
    desc: "Punjabi Jagran E paper - Digital Edition of Punjabi News Paper which is being circulated Amritsar, Bathinda, Chandigarh, Doaba, Gurdaspur, Jalandhar, Kapurthala, Ludhiana, Malwa, Patiala, and other cities of Punjab is available online also.",
    keywords:
      "Punjabi Jagran, Punjabi e Paper, Punjabi Jagran e Paper, Punjabi News Paper",
    canonical: "https://epaper.punjabijagran.com",
  },
};

export const getHomeMeta = (domain) => {
  return meta[domain] || {};
}