// @ts-nocheck
// import * as protos from "@headspace/protos-events";
//
// function decode(sqsMessage: Record<string, string>): void {
//   if (!sqsMessage) {
//     console.log(`The SQS message was not provided`);
//     return;
//   }
//   const messageId = sqsMessage.MessageId;
//   const encodedMessage = sqsMessage.Message;
//   const protobufMessageType = sqsMessage.MessageAttributes.ProtobufMessageType.Value;
//
//   console.info(`Decoding: ${messageId} - ${protobufMessageType}`);
//   console.info("=======================================================================");
//
//   const proto = protos[protobufMessageType];
//   const buffer = Buffer.from(encodedMessage, "base64");
//
//   console.log(proto.decode(buffer));
// }
//
// try {
//   const sqsMessage = JSON.parse(process.argv[2]);
//   decode(sqsMessage);
// } catch (e) {
//   console.log(`SQS Message is not valid JSON or the argument is incorrectly formatted`, e);
// }