export const removeOldest = async (model: any) => {
  const query = await model.find({}).sort({ createdAt: "ascending" });
  await model.deleteOne({ createdAt: query[0].createdAt });
};
