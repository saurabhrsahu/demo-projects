package weather

import cats.effect.{ExitCode, IO, IOApp}
import com.comcast.ip4s.*
import org.http4s.*
import org.http4s.client.Client
import org.http4s.dsl.io.*
import org.http4s.ember.client.EmberClientBuilder
import org.http4s.ember.server.EmberServerBuilder
import org.http4s.implicits.*

/** Demo: proxies [Open-Meteo](https://open-meteo.com/) (free, no API key). */
object Main extends IOApp {

  private def portFromEnv: Int =
    sys.env.get("PORT").flatMap(_.toIntOption).getOrElse(8080)

  private def openMeteoUri(lat: String, lon: String): Uri =
    Uri.unsafeFromString(
      s"https://api.open-meteo.com/v1/forecast?latitude=$lat&longitude=$lon&current_weather=true"
    )

  private def routes(client: Client[IO]): HttpRoutes[IO] = HttpRoutes.of[IO] {
    case GET -> Root =>
      Ok(
        """{"service":"scala-weather","source":"Open-Meteo (https://open-meteo.com/)","endpoints":["GET /healthz","GET /weather?lat=52.52&lon=13.41"]}"""
      )

    case GET -> Root / "healthz" =>
      Ok("""{"status":"ok","service":"scala-weather"}""")

    case req @ GET -> Root / "weather" =>
      val lat = req.uri.multiParams.get("lat").flatMap(_.headOption)
      val lon = req.uri.multiParams.get("lon").flatMap(_.headOption)
      (lat, lon) match {
        case (Some(la), Some(lo)) =>
          val uri = openMeteoUri(la, lo)
          client.get(uri) { resp =>
            if (resp.status.isSuccess) resp.as[String].flatMap(Ok(_))
            else
              BadGateway(s"""{"error":"upstream","status":${resp.status.code}}""")
          }
        case _ =>
          BadRequest(
            """{"error":"missing lat/lon","example":"/weather?lat=52.52&lon=13.41"}"""
          )
      }
  }

  def run(args: List[String]): IO[ExitCode] =
    EmberClientBuilder.default[IO].build.use { client =>
      val app = routes(client).orNotFound
      val port = portFromEnv
      val p = Port.fromInt(port).getOrElse(port"8080")
      EmberServerBuilder
        .default[IO]
        .withHost(ipv4"0.0.0.0")
        .withPort(p)
        .withHttpApp(app)
        .build
        .use(_ => IO.never)
    }
}
