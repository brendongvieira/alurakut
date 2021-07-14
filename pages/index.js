import React from "react";
import styled from "styled-components";
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

export default function Home() {
  const [community, setCommunity] = React.useState([
    {
      id: "1234567890",
      title: "Eu odeio acordar cedo",
      image: "http://alurakut.vercel.app/capa-comunidade-01.jpg",
    },
  ]);
  const githubUser = "brendongvieira";
  const myFriends = [
    "filipedeschamps",
    "peas",
    "juunegreiros",
    "omariosouto",
    "rafaballerini",
    "marcobrunodev",
  ];

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

                console.log("Campos: ", formsData.get("title"));
                console.log("Campos: ", formsData.get("image"));

                const communityObj = {
                  id: newDate().toISOString(),
                  title: formsData.get("title"),
                  image: formsData.get("image"),
                };
                const newCommunity = [...community, communityObj];
                setCommunity(newCommunity);
                console.log(newCommunity);
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
          <ProfileRelationsBoxWrapper>
            <ul>
              {community.map((thisUser) => {
                return (
                  <li key={thisUser.id}>
                    <a href={`/users/${thisUser.title}`}>
                      <img src={thisUser.image} />
                      <span>{thisUser.title}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Pessoas da comunidade ({myFriends.length})
            </h2>
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
          <Box>Comunidades</Box>
        </div>
      </MainGrid>
    </>
  );
}
