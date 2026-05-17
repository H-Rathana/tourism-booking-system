import qr from "qr-image";

export const generateKHQR = (amount, bookingId) => {
  const khqrData = `
000201010211
52045999
5303116
5405${amount}
5802KH
5913WanderEscape
6009PhnomPenh
62140510${bookingId}
6304ABCD
`;

  const qrSvg = qr.imageSync(khqrData, {
    type: "png",
  });

  return qrSvg.toString("base64");
};