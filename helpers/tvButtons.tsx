import { useEffect } from "react";
import { BackHandler, I18nManager, useTVEventHandler } from "react-native";

type UseTVButtonsProps = {
  key: string,
  actionMap?: { [action: string]: () => void },
  onForwardPressed?: () => void,
  onBackwardPressed?: () => void,
  onBackButtonPressed?: () => void,
  condition?: () => boolean
};


const backActions: { [action: string]: () => void } = {}


export function initTVButtons(){
    useEffect(() => {
        const subscription = BackHandler.addEventListener(
            'hardwareBackPress',
            () => {
                for (const key in backActions) {
                    backActions[key]();
                }
                return true;
            }
        );
        return () => subscription.remove();
    }, []);
}


export function useTVButtons({
  key,
  actionMap,
  onForwardPressed,
  onBackwardPressed,
  onBackButtonPressed = () => false,
  condition = () => true
}: UseTVButtonsProps) {

  useTVEventHandler((evt) => {

    if (!condition()) return;
    
    console.log("Button Function: ", evt);

    if (evt && evt.eventType && actionMap && actionMap[evt.eventType]) {
      actionMap[evt.eventType]();
    }

    if (onForwardPressed != null) {
      if (evt && evt.eventType) {
        if (
          (evt.eventType === "right" && !I18nManager.isRTL) ||
          (evt.eventType === "left" && I18nManager.isRTL)
        ) {
          onForwardPressed();
        }
      }
    }

    if (onBackwardPressed != null) {
      if (evt && evt.eventType) {
        if (
          (evt.eventType === "left" && !I18nManager.isRTL) ||
          (evt.eventType === "right" && I18nManager.isRTL)
        ) {
          onBackwardPressed();
        }
      }
    }

  });

  

    useEffect(() => {
        backActions[String(key)] = () => {
            if (condition()) {
                onBackButtonPressed();
            }
        };
    });


}
