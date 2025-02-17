class DirectusController {
    async createItem(req, res) {
      const { collection } = req.params;
      const data = req.body;
      try {
        const item = await DirectusService.createItem(collection, data);
  
        // 🔥 Trigger a webhook after successful creation
        await axios.post('http://localhost:3001/webhook-listener',{
          event: 'item_created',
          collection,
          item
        });
  
        res.status(201).json(item);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  }
  
  module.exports = new DirectusController();