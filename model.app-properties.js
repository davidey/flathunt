this.appPropertiesSchema = mongoose.Schema({
	oldestFlatFetch: { type: Date, default: Date.now },
});