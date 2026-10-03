const fs = require('fs');
let content = fs.readFileSync('src/pages/CookedWithoutCode/CookedWithoutCodePage.jsx', 'utf8');

const importStatement = \import React, { useState, useEffect } from 'react';
import { getPublicEventState } from '../../services/gameService';\;
content = content.replace(\import React from 'react';\, importStatement);

const hookCode = \export default function CookedWithoutCodePage({ onNavigate }) {
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const checkState = async () => {
      const state = await getPublicEventState(UPCOMING_FLAGSHIP_EVENT.id);
      if (state.success && state.isCompleted) {
        setIsCompleted(true);
      }
    };
    checkState();
  }, []);\;
content = content.replace(\export default function CookedWithoutCodePage({ onNavigate }) {\, hookCode);

const buttonTarget = \<Button
                variant="signal"
                size="lg"
                onClick={() => onNavigate && onNavigate('cooked-without-code-game')}
                icon={ArrowRight}
              >
                ENTER GAME
              </Button>\;
const buttonReplacement = \{isCompleted ? (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => window.location.hash = '#/archive/' + UPCOMING_FLAGSHIP_EVENT.id}
                  icon={ArrowRight}
                >
                  EVENT COMPLETE — VIEW ARCHIVE
                </Button>
              ) : (
                <Button
                  variant="signal"
                  size="lg"
                  onClick={() => onNavigate && onNavigate('cooked-without-code-game')}
                  icon={ArrowRight}
                >
                  ENTER GAME
                </Button>
              )}\;
content = content.replace(buttonTarget, buttonReplacement);

fs.writeFileSync('src/pages/CookedWithoutCode/CookedWithoutCodePage.jsx', content);
