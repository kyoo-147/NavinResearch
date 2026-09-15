import sandora from "../products/content/sandora.mjs";
import moyi from "../products/content/moyi.mjs";
import sori from "../products/content/sori.mjs";
import howhow from "../products/content/howhow.mjs";
import dossier from "../products/content/dossier.mjs";
import autopilot from "../products/content/autopilot.mjs";
import lajvard from "../products/content/lajvard.mjs";

export const products = [sandora, moyi, sori, howhow, dossier, autopilot, lajvard];

export const teraflow = {
  slug: "teraflow",
  name: "TeraFlow",
  eyebrow: "SMART MOBILITY / COMPUTER VISION",
  thesis: "Computer vision and multimodal perception for intelligent transport systems.",
  catalogCopy: {
    vi: {
      eyebrow: "GIAO THÔNG THÔNG MINH / THỊ GIÁC MÁY TÍNH",
      thesis: "Thị giác máy tính và nhận thức đa phương thức cho các hệ thống giao thông thông minh.",
    },
    "zh-cn": {
      eyebrow: "智能交通 / 计算机视觉",
      thesis: "面向智能交通系统的计算机视觉与多模态感知。",
    },
  },
  intro: "TeraFlow turns camera and LiDAR data into a live, trackable model of road activity.",
  capabilities: ["Camera and LiDAR perception", "Multi-object tracking", "Traffic operations"],
  status: "PRODUCT",
  catalogStatus: "product",
  url: "https://teraflow.navinresearch.com/",
};

export const catalogProducts = [...products, teraflow];
