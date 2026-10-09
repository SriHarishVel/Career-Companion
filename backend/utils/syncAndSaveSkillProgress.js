import Skill from "../models/Skill.js";
import Resource from "../models/Resource.js";

import { syncSkillProgress } from "./syncSkillProgress.js";

export async function syncAndSaveSkillProgress(
  userId,
  skillId,
  changeContext = {},
) {
  if (!skillId) {
    return null;
  }

  const skill = await Skill.findOne({
    _id: skillId,
    user: userId,
  });

  if (!skill) {
    return null;
  }

  const resources = await Resource.find({
    skill: skill._id,
    user: userId,
  });

  const previousProgress = skill.progress;

  const syncedSkill = syncSkillProgress(
    skill.toObject(),
    resources,
  );

  skill.progress = syncedSkill.progress;
  skill.developmentStatus = syncedSkill.developmentStatus;

  if (previousProgress !== syncedSkill.progress) {
    if (!Array.isArray(skill.progressHistory)) {
      skill.progressHistory = [];
    }

    skill.progressHistory.push({
      previousProgress,
      newProgress: syncedSkill.progress,
      action: changeContext.action || "Progress updated",
      itemName: changeContext.itemName || "",
      details: changeContext.details || "",
      updatedAt: new Date(),
    });
  }

  await skill.save();

  return skill;
}