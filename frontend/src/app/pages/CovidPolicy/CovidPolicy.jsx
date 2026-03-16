import Breadcrumb from "@/app/components/Breadcum";
import React from "react";

const CovidPolicy = () => {
  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Coronavirus Advisory And Policy", href: null },
        ]}
      />
      <section className="py-10">
        <div className="max-w-4xl mx-auto px-4 bg-red-700 p-5 text-white">
          <div>
            <p className="text-2xl font-bold bg-black text-white p-4 mb-10 text-center">
              COVID-19: Public Notice No. 10
            </p>
            <p className="text-md text-justify mb-4">
              On the 11th of March 2020, the World Health Organisation (WHO)
              declared the COVID-19 outbreak a global pandemic (www.who.int). On
              the same day, the Government of India issued travel related
              notifications which effectively shut down all modes of travel,
              both within India and also to foreign countries
              (www.india.gov.in). Around this time, similar travel restrictions
              also came to be imposed by governments of many countries the world
              over. Further, across the world, these travel restrictions were
              accompanied by lockdown on the movement of people, and also on
              commercial activities.
            </p>
            <p className="text-md text-justify mb-4">
              This force majeure situation and the worldwide travel related
              lockdown made it impossible for tourists (individuals and groups)
              to undertake their travel plans and altogether made it impossible
              for travel and tourism companies like Heaven Holiday to deliver
              services, despite most travel logistics at our end being in a
              state of readiness, sometimes over a year in advance.
            </p>
            <p className="text-md text-justify mb-4">
              Under these circumstances, and particularly with a view to
              ensuring that our guests do not lose their hard-earned monies,
              Heaven Holiday postponed all its group tour departures until 30th
              September 2020, and since lockdowns have been continually
              extended, further postponements, if any, would be in line with
              travel advisories issued by the Indian as well as other
              governments.
            </p>
            <p className="text-md text-justify mb-4">
              While some guests have opted to cancel their tours as per Veena
              World’s cancellation policy, an overwhelmingly large number of our
              guests have postponed their tours to a future date. To those who
              have postponed their tours, Heaven Holiday has decided to issue
              fresh Future Tour Vouchers (FTVs). In these FTVs, guests would
              notice that 100% of their tour money has been protected and placed
              into a credit shell. Also, for these future tours, Heaven Holiday
              will honour the original tour price paid by guests (except where
              any future bookings are for super peak season dates, in which case
              a surcharge could be applicable). For guests with FTVs, there may
              be a small expense payable. This estimated maximum expense for all
              group tour guests is towards but not limited to: fresh visa
              charges, any airline fee increase, our operational expenses,
              foreign exchange fluctuations, statutory taxes, etc. (+ applicable
              GST). We have further protected our guests by indicating in the
              FTV the maximum estimated expense which may have to be paid. The
              said expense would be payable when guests confirm the booking of
              their future tour. Additionally, Guests who have opted for
              additional service/s like business-class air tickets, cruise
              upgradations, deviations etc. may please note that unless our
              associates reduce these expenses, guests may be charged any price
              differential as on the date of booking these services for the
              future tour. The process of issuing fresh FTVs has commenced and
              guests would soon receive these on their registered email ID.
            </p>
            <p className="text-md text-justify mb-4">
              Our guests would appreciate that despite there being no guarantee
              that prices worldwide (including taxes) will or will not increase
              over the next 18 months, we at Heaven Holiday are taking that risk
              purely keeping in mind the interests of our guests. Guests are
              requested to note that Heaven Holiday would continue to work
              closely with its travel partners/associates worldwide to try and
              reduce the said estimated expenses even lower; and should our
              worldwide associates give us any reduction/consideration, that
              would immediately be credited to the guest’s future tour voucher,
              thereby reducing this expense.
            </p>
            <p className="text-md text-justify mb-4">
              Recently, guests have enquired whether these future tour vouchers
              can be extended for travel beyond March 31, 2021? At great risk in
              these uncertain times, Heaven Holiday is happy to announce that
              the future tour option has now been extended for travel before
              December 31, 2021 (subject of course to travel-related
              notifications of various governments).
            </p>
            <p className="text-md text-justify mb-4">
              Individual travellers who have booked their holidays with Veena
              World's ‘Customized Holidays’ division have been contacted for the
              postponement of their holiday. Any difference in holiday prices
              due to change of travel dates/hotels/package category/fare
              difference/GST will be additional and will be advised at the time
              of confirmation of a holiday as per revised dates.
            </p>
            <p className="text-md text-justify mb-4">
              After six months of strict lockdown, Unlock 4.0 has now been
              initiated by the Government of India. As part of the guidelines of
              Unlock 4.0, in the State of Maharashtra, all private offices are
              now allowed to operate at 30% strength with strict social
              distancing guidelines. With this background, and looking forward
              to a fresh start, a few of our Sales offices i.e. Pune –
              Bhandarkar Road, Prabhadevi - A.M. Marg, Borivali - S.V. Road,
              Thane - Ram Maruti Road, Dombivali - Phadke Road, Vashi - Real
              Tech Park, Chembur - Acharya Garden and Kolkata - Lee Road, are
              proposed to physically open from 28th September 2020, a day after
              World Tourism Day, from Monday to Friday between 11 AM and 5 PM.
              Keeping in mind the government guidelines on social distancing and
              health-n-safety of all, office visits will be allowed with a prior
              appointment. Please contact your travel advisor for a confirmed
              appointment slot. Of course, our helpline 1800 22 7979 is always
              open for you from Monday to Saturday between 10 AM and 6 PM or you
              can also write to us on travel@heavenHoliday.com for any tour
              query/assistance.
            </p>
            <p className="text-md text-justify mb-4">
              Heaven Holiday looks forward to serving you soon and wishes you
              and your family good health & safety.
            </p>

            <div className="mt-10 flex justify-between">
              <p className="text-md text-justify">Take Care, Stay Safe</p>
              <p className="text-md text-justify">Dated: September 23, 2020</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CovidPolicy;
