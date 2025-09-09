import Startup from "../models/startups.model.js";

// ----------
// -- Read --
// ----------

export const getAll = async (req, res) => {
  const sql = req.app.get("db");
  try {
    const startups = await Startup.getAll(sql);
    res.status(200).json(startups);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const getById = async (req, res) => {
  const sql = req.app.get("db");
  const { id } = req.params;
  try {
    const startup = await Startup.getById(sql, id);
    if (!startup[0]) return res.status(404).json({ error: "Startup non trouvée" });

    const relations = await Startup.getRelationsByStartupId(sql, startup[0].id);
    
    const founders = await Promise.all(
      relations.map((rel) => Startup.getFounderById(sql, rel.founder_id))
    );

    const startupWithFounders = {
      ...startup[0],
      founders,
    };

    res.status(200).json(startupWithFounders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const getFounderImage = async (req, res) => {
  const sql = req.app.get("db");
  const { founder_id } = req.params;
  try {
    const image = await Startup.getFounderImage(sql, founder_id);
    if (!image[0]) return res.status(404).json({ error: "Founder not found for this startup" });
    res.status(200).json({ image: image[0].image });
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// ------------
// -- Create --
// ------------

export const create = async (req, res) => {
  const sql = req.app.get("db");
  try {
    const { founders, ...startupData } = req.body;

    const [newStartup] = await Startup.create(sql, startupData);

    if (founders && Array.isArray(founders)) {
      const processedFounders = await Promise.all(
        founders.map(async (founderData) => {
          let founder;

          if (founderData.name) {
            const existingFounder = await Startup.getFounderByName(sql, founderData.name);
            if (existingFounder) {
              founder = existingFounder;
            }
          }

          if (!founder) {
            founder = await Startup.createFounder(sql, founderData);
          }

          await Startup.createStartupFounderRelation(sql, newStartup.id, founder.id);
          
          return founder;
        })
      );

      res.status(201).json({
        ...newStartup,
        founders: processedFounders
      });
    } else {
      res.status(201).json(newStartup);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// ------------
// -- Delete --
// ------------

export const deleteById = async (req, res) => {
  const sql = req.app.get("db");
  const { id } = req.params;
  
  try {
    const result = await Startup.deleteById(sql, id);
    
    if (result.count === 0) {
      return res.status(404).json({ error: "Startup not found" });
    }
    
    res.status(200).json({ message: "Startup deleted successfully" });
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ------------
// -- Update --
// ------------

export const update = async (req, res) => {
  const sql = req.app.get("db");
  const { id } = req.params;
  const { founders, ...startupData } = req.body;
  
  try {
    const result = await Startup.update(sql, startupData, id);
    
    if (result.count === 0) {
      return res.status(404).json({ error: "Startup not found" });
    }

    if (founders && Array.isArray(founders)) {
      const currentRelations = await Startup.getRelationsByStartupId(sql, id);
      const currentFounderIds = currentRelations.map(rel => rel.founder_id);
      const newFounderIds = [];

      const processedFounders = await Promise.all(
        founders.map(async (founderData) => {
          let founder;

          if (founderData.id) {
            const existingFounder = await Startup.getFounderById(sql, founderData.id);
            if (existingFounder) {
              founder = existingFounder;
              if (Object.keys(founderData).length > 1) {
                const { id, ...updateData } = founderData;
                await Startup.updateFounder(sql, updateData, id);
                founder = { ...founder, ...updateData };
              }
            }
          }

          if (!founder && founderData.name) {
            const existingFounder = await Startup.getFounderByName(sql, founderData.name);
            if (existingFounder) {
              founder = existingFounder;
            }
          }

          if (!founder) {
            founder = await Startup.createFounder(sql, founderData);
          }
          
          newFounderIds.push(founder.id);

          if (!currentFounderIds.includes(founder.id)) {
            await Startup.createStartupFounderRelation(sql, id, founder.id);
          }
          
          return founder;
        })
      );

      const relationsToDelete = currentFounderIds.filter(founderId => !newFounderIds.includes(founderId));
      for (const founderId of relationsToDelete) {
        await Startup.deleteStartupFounderRelation(sql, id, founderId);
      }
      
      res.status(200).json({ 
        message: "Startup updated successfully",
        founders: processedFounders
      });
    } else {
      res.status(200).json({ message: "Startup updated successfully" });
    }
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
