import { canceledAppointmentTemplate, sendMail, To } from "../utils/email";

class CancellationMail {

    get key() {
        return "CancellationMail";
    }

    async handle({ data }: { data: { to: To, clientName: string, date: Date } }) {
        const { to, clientName, date } = data;
        await sendMail(
            data.to,
            "Agendamento cancelado",
            canceledAppointmentTemplate({
                to,
                clientName,
                date
            })
        );
    }

}

export default new CancellationMail();