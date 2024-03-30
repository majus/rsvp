import { Registration } from '../model';
import { transferToken } from '/api/telegram';

Registration.extend({
  events: {
    async afterUpdate(e) {
      const registration = e.currentTarget;
      if (registration.isConfirmed() && !registration.isRefunded()) {
        // Process refund
        await transferToken(
          registration.depositAddress,
          registration.depositAmount,
        );
      }
    },
  },
});
