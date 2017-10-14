<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Config
 *
 * @ORM\Table(name="config")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\ConfigRepository")
 */
class Config
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="websocket_server_address", type="string", length=255)
     */
    private $websocketServerAddress;

    /**
     * @var string
     *
     * @ORM\Column(name="language", type="string", length=10)
     */
    private $language;


    /**
     * Get id
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set websocketServerAddress
     *
     * @param string $websocketServerAddress
     *
     * @return Config
     */
    public function setWebsocketServerAddress($websocketServerAddress)
    {
        $this->websocketServerAddress = $websocketServerAddress;

        return $this;
    }

    /**
     * Get websocketServerAddress
     *
     * @return string
     */
    public function getWebsocketServerAddress()
    {
        return $this->websocketServerAddress;
    }

    /**
     * Set language
     *
     * @param string $language
     *
     * @return Config
     */
    public function setLanguage($language)
    {
        $this->language = $language;

        return $this;
    }

    /**
     * Get language
     *
     * @return string
     */
    public function getLanguage()
    {
        return $this->language;
    }
}

