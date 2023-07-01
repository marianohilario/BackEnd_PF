import { Router } from "express";

const router = Router()

router.get("/:level", (req, res) => {
  const { level } = req.params;
  switch (level) {
    case "fatal": {
      req.logger.fatal("Log de nivel Fatal");
      break;
    }
    case "error": {
      req.logger.error("Log de nivel Error");
      break;
    }
    case "warning": {
      req.logger.warning("Log de nivel Warning");
      break;
    }
    case "info": {
      req.logger.info("Log de nivel Info");
      break;
    }
    case "http": {
      req.logger.http("Log de nivel Http");
      break;
    }
    case "debug": {
      req.logger.debug("Log originado en ruta de prueba Debug");
      break;
    }
  }
  res.send(`Error ${ level } resuelto`);
});

export default router