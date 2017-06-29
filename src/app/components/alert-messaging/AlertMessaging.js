import { smallBox } from "../utils/actions/MessageActions";

const TIMEOUT = 4000

export function smallAlertMessage(title, description, type) {
    /*Function to display alert message box to the dom

    args:
        title: string
        description: string
        type: string
    */
    switch (type) {
        case "danger":
            // Displays red message box
            smallBox({
                title: title,
                content: "<i class='fa fa-clock-o'></i> <i>" + description + "</i>",
                color: "#C46A69",
                iconSmall: "fa fa-check fa-2x fadeInRight animated",
                timeout: TIMEOUT
            });
            break
        case "success":
            // Displays green message box
            smallBox({
                title: title,
                content: "<i class='fa fa-clock-o'></i> <i>" + description + "</i>",
                color: "#659265",
                iconSmall: "fa fa-check fa-2x fadeInRight animated",
                timeout: TIMEOUT
            });
            break
    }
}