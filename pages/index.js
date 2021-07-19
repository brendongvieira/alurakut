import React from "react";
import nookies from "nookies";
import jwt from "jsonwebtoken";
import MainGrid from "../src/components/MainGrid";
import Box from "../src/components/Box";
import {
  AlurakutMenu,
  AlurakutProfileSidebarMenuDefault,
  OrkutNostalgicIconSet,
} from "../src/lib/AlurakutCommuns";
import { ProfileRelationsBoxWrapper } from "../src/components/ProfileRelations";

function ProfileSideBar(props) {
  return (
    <Box>
      <img
        src={`https://github.com/${props.githubUser}.png`}
        style={{ borderRadius: "8px" }}
      />
      <hr />
      <p>
        <a className="boxLink" href={`https://github.com/${props.githubUser}`}>
          @{props.githubUser}
        </a>
      </p>
      <hr />

      <AlurakutProfileSidebarMenuDefault />
    </Box>
  );
}

function ProfileRelationsBox(props) {
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
        {props.title} ({props.items.length})
      </h2>
      <ul>
        {/* {followers.map((thisUser) => {
        return (
          <li key={thisUser}>
            <a href={`https://github.com/users/${thisUser}.png`}>
              <img src={thisUser.image} />
              <span>{thisUser}</span>
            </a>
          </li>
        );
      })} */}
      </ul>
    </ProfileRelationsBoxWrapper>
  );
}

export default function Home(props) {
  const [community, setCommunity] = React.useState([]);
  const githubUser = props.githubUser;
  const myFriends = [
    "filipedeschamps",
    "peas",
    "juunegreiros",
    "omariosouto",
    "rafaballerini",
    "marcobrunodev",
  ];
  const [followers, setFollowers] = React.useState([]);

  React.useEffect(() => {
    //API Github
    fetch("https://api.github.com/users/brendongvieira/following")
      .then((serverResponse) => {
        return serverResponse.json();
      })
      .then((fullData) => {
        setFollowers(fullData);
      });

    //API GraphQL
    fetch("https://graphql.datocms.com", {
      method: "POST",
      headers: {
        Authorization: "1c9fd05bcc424ceb07957d5a9a12d3",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: `query {
        allCommunities {
          title
          id
          imageUrl
          creatorSlug
        }
      }`,
      }),
    })
      .then((response) => response.json())
      .then((fullResponse) => {
        const communitiesFromDato = fullResponse.data.allCommunities;
        console.log(communitiesFromDato);
        setCommunity(communitiesFromDato);
      });
  }, []);

  return (
    <>
      <div>
        <AlurakutMenu githubUser={githubUser} />
      </div>
      <MainGrid>
        <div className="profileArea" style={{ gridArea: "profileArea" }}>
          <ProfileSideBar githubUser={githubUser} />
        </div>
        <div className="welcomeArea" style={{ gridArea: "welcomeArea" }}>
          <Box>
            <h1 className="title">Bem vindo(a)</h1>

            <OrkutNostalgicIconSet />
          </Box>
          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formsData = new FormData(e.target);

                console.log("Campo titulo: ", formsData.get("title"));
                console.log("Campos imagem: ", formsData.get("image"));

                const communityObj = {
                  title: formsData.get("title"),
                  imageUrl: formsData.get("image"),
                  creatorSlug: githubUser,
                };

                fetch("/api/communities", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(communityObj),
                }).then(async (response) => {
                  const data = await response.json();
                  console.log(data.createdRegister);
                  const communityObj = data.createdRegister;
                  const newCommunity = [...community, communityObj];
                  setCommunity(newCommunity);
                });

                // console.log(newCommunity);
              }}
            >
              <div>
                <input
                  placeholder="Qual vai ser o nome da sua comunidade?"
                  name="title"
                  aria-label="Qual vai ser o nome da sua comunidade?"
                  type="text"
                />
              </div>
              <div>
                <input
                  placeholder="Coloque uma URL para usarmos de capa"
                  name="image"
                  aria-label="Coloque uma URL para usarmos de capa"
                  type=""
                />
              </div>

              <button>Criar comunidade</button>
            </form>
          </Box>
        </div>
        <div
          className="profileRelationsArea"
          style={{ gridArea: "profileRelationsArea" }}
        >
          <ProfileRelationsBox title={"Seguidores"} items={followers} />

          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">Seguindo ({myFriends.length})</h2>
            <ul>
              {myFriends.map((thisUser) => {
                return (
                  <li key={thisUser}>
                    <a href={"/users/${thisUser}"}>
                      <img src={`https://github.com/${thisUser}.png`} />
                      <span>{thisUser}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">Comunidades ({community.length})</h2>
            <ul>
              {community.map((thisUser) => {
                return (
                  <li key={thisUser.id}>
                    <a href={`/communities/${thisUser.id}`}>
                      <img src={thisUser.imageUrl} />
                      <span>{thisUser.title}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
        </div>
      </MainGrid>
    </>
  );
}

export async function getServerSideProps(context) {
  const cookies = nookies.get(context);
  const token = cookies.USER_TOKEN;

  const { isAuthenticated } = await fetch(
    "https://alurakut.vercel.app/api/auth",
    {
      headers: {
        Authorization: token,
      },
    }
  ).then((response) => response.json());

  console.log("isAuthenticated", isAuthenticated);

  if (!isAuthenticated) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const { githubUser } = jwt.decode(token);
  return {
    props: {
      githubUser,
    }, // will be passed to the page component as props
  };
}
