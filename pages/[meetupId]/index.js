import Head from "next/head";
import { Fragment } from "react";
import { MongoClient, ObjectId } from "mongodb";
import MeetupDetail from "../../components/meetups/MeetupDetail";

const MeetupDetails = (props) => {
  return (
    <Fragment>
        <Head>
            <title>{props.meetupData.title}</title>
            <meta name="description" content={props.meetupData.description} />
        </Head>
      <MeetupDetail
        image={props.meetupData.image}
        title={props.meetupData.title}
        address={props.meetupData.address}
        description={props.meetupData.description}
      />
    </Fragment>
  );
};

export async function getStaticPaths() {
  const client = await MongoClient.connect(
    "mongodb+srv://Miraz:dYLtcaflec3kIliX@cluster0.kimgo.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");
  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

  client.close();

  return {
    fallback: false,
    paths: meetups.map((meetup) => ({
      params: {
        meetupId: meetup._id.toString(),
      },
    })),
  };
}

export async function getStaticProps(context) {
  const meetupId = context.params.meetupId;

  const client = await MongoClient.connect(
    "mongodb+srv://Miraz:dYLtcaflec3kIliX@cluster0.kimgo.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");
  const selectedMeetups = await meetupsCollection.findOne({
    _id: ObjectId(meetupId),
  });

  return {
    props: {
      meetupData: {
        id: selectedMeetups._id.toString(),
        image: selectedMeetups.image,
        title: selectedMeetups.title,
        address: selectedMeetups.address,
        description: selectedMeetups.description,
      },
    },
  };
}

export default MeetupDetails;
