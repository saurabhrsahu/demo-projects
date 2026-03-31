name := "scala-weather"
version := "0.1.0"
scalaVersion := "3.3.4"

val http4sVersion = "0.23.27"

libraryDependencies ++= Seq(
  "org.http4s" %% "http4s-dsl"          % http4sVersion,
  "org.http4s" %% "http4s-ember-server" % http4sVersion,
  "org.http4s" %% "http4s-ember-client" % http4sVersion,
  "org.slf4j"   % "slf4j-simple"       % "2.0.13"
)

assembly / assemblyJarName := "scala-weather.jar"
assembly / mainClass := Some("weather.Main")

assembly / assemblyMergeStrategy := {
  case PathList("META-INF", "services", _*) => MergeStrategy.concat
  case PathList("META-INF", _*)             => MergeStrategy.discard
  case "module-info.class"                 => MergeStrategy.discard
  case x                                   => MergeStrategy.first
}
